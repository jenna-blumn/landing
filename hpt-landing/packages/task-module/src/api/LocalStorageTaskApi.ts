import type { Task, TaskStatus, TaskStats, CreateTaskInput, UpdateTaskInput, CreateNoticeInput, NoticeReadStatus } from '../types/task';
import type { ITaskApi } from './ITaskApi';
import { EventBus } from '../utils/eventBus';

const TASKS_UPDATED_EVENT = 'task-management-updated';

export class LocalStorageTaskApi implements ITaskApi {
  private userId: string;
  private storageKey: string;
  private eventBus: EventBus;

  constructor(userId: string, storageKey: string = 'taskManagement_v2') {
    this.userId = userId;
    this.storageKey = storageKey;
    this.eventBus = new EventBus();
  }

  // ── helpers ───────────────────────────────────────────────────────────

  private emitTasksUpdated(): void {
    this.eventBus.emit(TASKS_UPDATED_EVENT);
    // Backward-compatible window event during transition period
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(TASKS_UPDATED_EVENT));
    }
  }

  private migrateTask(task: unknown): Task {
    if (typeof task !== 'object' || task === null) {
      return task as unknown as Task;
    }
    const migrated = { ...(task as Record<string, unknown>) };

    // Legacy compatibility: ticket type has been removed.
    if (migrated.type === 'ticket') {
      migrated.type = 'followup';
    }

    if (migrated.deadline === undefined) {
      migrated.deadline = null;
    }

    if (migrated.order === undefined) {
      migrated.order = migrated.createdAt || Date.now();
    }

    if (migrated.pinned === undefined) {
      migrated.pinned = false;
    }
    if (migrated.pinnedAt === undefined) {
      migrated.pinnedAt = null;
    }
    if (migrated.backgroundColor === undefined) {
      migrated.backgroundColor = null;
    }

    // ownerId migration: existing localStorage data may not have ownerId
    if (migrated.ownerId === undefined) {
      migrated.ownerId = this.userId;
    }

    return migrated as unknown as Task;
  }

  private calculateTaskStatus(
    scheduledDate: string | null,
    deadline: string | null,
    currentStatus: TaskStatus
  ): TaskStatus {
    if (currentStatus === 'completed') {
      return 'completed';
    }

    const referenceDate = deadline || scheduledDate;

    if (!referenceDate) {
      return 'pending';
    }

    const scheduled = new Date(referenceDate);
    scheduled.setHours(23, 59, 59, 999);
    const now = new Date();

    if (scheduled < now) {
      return 'delayed';
    }

    return 'pending';
  }

  private getInitialMockTasks(): Task[] {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const today = new Date().toISOString().split('T')[0];

    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    const deadlineDate = dayAfterTomorrow.toISOString().split('T')[0];

    const task1CreatedAt = yesterday.getTime();
    const task2CreatedAt = Date.now() - 3600000;
    const notice1CreatedAt = Date.now() - 7200000;
    const notice2CreatedAt = Date.now() - 10800000;

    const mockConsultants: NoticeReadStatus[] = [
      { consultantId: 'c1', consultantName: '이상담', isRead: true, readAt: Date.now() - 86400000 },
      { consultantId: 'c2', consultantName: '박상담', isRead: false, readAt: null },
      { consultantId: 'c3', consultantName: '최상담', isRead: true, readAt: Date.now() - 43200000 },
      { consultantId: 'c4', consultantName: '정상담', isRead: false, readAt: null },
      { consultantId: 'manager', consultantName: '매니저', isRead: false, readAt: null },
    ];

    return [
      {
        id: 'task_mock_1',
        ownerId: this.userId,
        type: 'callback',
        title: '배송 지연 건 콜백 요청 (roomId 301)',
        description: '배송 지연으로 인한 고객 불만 접수. 클릭 시 오버레이가 나타나며 컨택룸이 열립니다.',
        scheduledDate: today,
        deadline: null,
        status: 'delayed',
        liked: false,
        parentId: null,
        roomId: 301,
        messageId: null,
        order: task1CreatedAt,
        createdAt: task1CreatedAt,
        completedAt: null,
        pinned: false,
        pinnedAt: null,
        backgroundColor: null,
      },
      {
        id: 'task_mock_2',
        ownerId: this.userId,
        type: 'followup',
        title: '영업 성과 미팅 준비 (roomId 없음)',
        description: '이 작업은 연결된 컨택룸이 없습니다. 일반 상세 화면이 나타나야 합니다.',
        scheduledDate: today,
        deadline: deadlineDate,
        status: 'pending',
        liked: true,
        parentId: null,
        roomId: null,
        messageId: null,
        order: task2CreatedAt,
        createdAt: task2CreatedAt,
        completedAt: null,
        pinned: false,
        pinnedAt: null,
        backgroundColor: null,
      },
      {
        id: 'task_mock_3',
        ownerId: this.userId,
        type: 'sms',
        title: '신규 고객 상담 요청 (roomId 102)',
        description: '카카오톡을 통해 인입된 신규 고객 문의입니다.',
        scheduledDate: today,
        deadline: null,
        status: 'pending',
        liked: false,
        parentId: null,
        roomId: 102,
        messageId: null,
        order: task2CreatedAt + 1000,
        createdAt: task2CreatedAt + 1000,
        completedAt: null,
        pinned: false,
        pinnedAt: null,
        backgroundColor: null,
      },
      {
        id: 'task_notice_1',
        ownerId: 'manager',
        type: 'notice',
        title: '시스템 점검 안내',
        description: '오늘 오후 2시부터 4시까지 시스템 점검이 예정되어 있습니다.',
        scheduledDate: today,
        deadline: null,
        status: 'pending',
        liked: false,
        parentId: null,
        roomId: null,
        messageId: null,
        order: notice1CreatedAt,
        createdAt: notice1CreatedAt,
        completedAt: null,
        pinned: false,
        pinnedAt: null,
        backgroundColor: null,
        isRead: false,
        noticeContent: `안녕하세요, 운영팀입니다.

서비스 품질 향상을 위한 정기 시스템 점검이 예정되어 있어 안내드립니다.

■ 점검 일시: 오늘 오후 2시 ~ 4시 (약 2시간)
■ 점검 내용: 서버 안정화 및 보안 패치 적용
■ 영향 범위: 전체 서비스 일시 중단

점검 시간 동안에는 서비스 이용이 불가하오니, 업무에 참고 부탁드립니다.
점검이 조기 완료되는 경우 별도 안내 없이 서비스가 재개됩니다.

불편을 드려 죄송합니다.
감사합니다.`,
        author: '운영팀 김관리',
        targetAudience: mockConsultants,
        requireReadConfirmation: true,
      },
      {
        id: 'task_notice_2',
        ownerId: 'manager',
        type: 'notice',
        title: '신규 기능 업데이트 공지',
        description: '데스크잇 보드에 새로운 필터 기능이 추가되었습니다.',
        scheduledDate: today,
        deadline: null,
        status: 'pending',
        liked: false,
        parentId: null,
        roomId: null,
        messageId: null,
        order: notice2CreatedAt,
        createdAt: notice2CreatedAt,
        completedAt: null,
        pinned: false,
        pinnedAt: null,
        backgroundColor: null,
        isRead: false,
        noticeContent: `안녕하세요, 개발팀입니다.

데스크잇 보드에 새로운 기능이 추가되어 안내드립니다.

■ 신규 기능
1. 기간별 필터링: 캘린더에서 날짜 범위를 선택하여 해당 기간의 할일만 조회
2. 상세보기 모드: 캘린더와 함께 할일 목록을 한눈에 확인
3. 공지사항 뷰어: 공지 클릭 시 상세 내용을 깔끔하게 확인

■ 사용 방법
- GNB의 캘린더 아이콘을 클릭하여 상세보기 모드로 진입
- 캘린더에서 원하는 날짜를 클릭하여 기간 선택
- 할일 항목 클릭 시 연결된 상담 또는 공지 내용 확인

피드백이 있으시면 개발팀으로 연락 부탁드립니다.
감사합니다.`,
        author: '개발팀 박개발',
        targetAudience: mockConsultants,
        requireReadConfirmation: true,
      },
      {
        id: 'task_notice_3',
        ownerId: 'manager',
        type: 'notice',
        title: '휴일 근무 안내',
        description: '다음 주 월요일은 대체 휴일입니다.',
        scheduledDate: today,
        deadline: null,
        status: 'pending',
        liked: true,
        parentId: null,
        roomId: null,
        messageId: null,
        order: notice2CreatedAt - 1000,
        createdAt: notice2CreatedAt - 1000,
        completedAt: null,
        pinned: false,
        pinnedAt: null,
        backgroundColor: null,
        isRead: false,
        noticeContent: `안녕하세요, 인사팀입니다.

다음 주 월요일 대체 휴일 관련 안내드립니다.

■ 휴일: 다음 주 월요일 (대체 공휴일)
■ 근무 인원: 필수 인원만 교대 근무

긴급 상황 발생 시 비상 연락망을 통해 연락 부탁드립니다.

좋은 휴일 보내세요!`,
        author: '인사팀 이인사',
        targetAudience: mockConsultants,
        requireReadConfirmation: true,
      },
      {
        id: 'task_notice_4',
        ownerId: 'manager',
        type: 'notice',
        title: '상담 품질 개선을 위한 교육 프로그램 안내',
        description: '다음 주 수요일 오전 10시, 상담 품질 향상 교육이 진행됩니다.',
        scheduledDate: today,
        deadline: null,
        status: 'pending',
        liked: false,
        parentId: null,
        roomId: null,
        messageId: null,
        order: notice2CreatedAt - 2000,
        createdAt: notice2CreatedAt - 2000,
        completedAt: null,
        pinned: false,
        pinnedAt: null,
        backgroundColor: null,
        isRead: false,
        noticeContent: `안녕하세요, 교육팀입니다.

고객 만족도 향상을 위한 상담 품질 개선 교육 프로그램을 실시합니다.

■ 교육 일시: 다음 주 수요일 오전 10시 ~ 12시
■ 교육 장소: 본사 3층 대회의실 (온라인 동시 진행)
■ 교육 내용:
  1. 효과적인 고객 응대 기법
  2. 클레임 상황 대처 방법
  3. 감정노동 스트레스 관리
  4. AI 어시스턴트 활용 방법

■ 준비물: 노트북, 필기구
■ 참석 대상: 전체 상담사 (필수 참석)

교육 시간 동안 상담 업무는 교대로 진행되며, 일정은 별도 공지됩니다.
참석 불가 시 팀장에게 사전 보고 부탁드립니다.

많은 참여 부탁드립니다.
감사합니다.`,
        author: '교육팀 최교육',
        targetAudience: mockConsultants,
        requireReadConfirmation: true,
      },
      {
        id: 'task_notice_5',
        ownerId: 'manager',
        type: 'notice',
        title: '보안 정책 업데이트 및 비밀번호 변경 안내',
        description: '보안 강화를 위해 비밀번호 정책이 변경되었습니다.',
        scheduledDate: today,
        deadline: null,
        status: 'pending',
        liked: false,
        parentId: null,
        roomId: null,
        messageId: null,
        order: notice2CreatedAt - 3000,
        createdAt: notice2CreatedAt - 3000,
        completedAt: null,
        pinned: false,
        pinnedAt: null,
        backgroundColor: null,
        isRead: false,
        noticeContent: `안녕하세요, 보안팀입니다.

개인정보 보호 및 보안 강화를 위해 비밀번호 정책이 변경되어 안내드립니다.

■ 변경 내용
1. 비밀번호 최소 길이: 8자 → 10자
2. 특수문자 필수 포함: 1개 이상
3. 비밀번호 변경 주기: 90일 (기존 동일)
4. 최근 3개 비밀번호 재사용 불가

■ 시행 일자: 이번 주 금요일부터 적용
■ 조치 사항: 금요일까지 새로운 정책에 맞춰 비밀번호 변경 필수

■ 변경 방법
1. 시스템 로그인 후 우측 상단 프로필 클릭
2. "비밀번호 변경" 메뉴 선택
3. 새로운 정책에 맞는 비밀번호 입력

■ 주의사항
- 생일, 전화번호 등 추측 가능한 정보 사용 금지
- 타인과 비밀번호 공유 금지
- 정기적인 비밀번호 변경 권장

기한 내 변경하지 않을 경우 시스템 접근이 제한될 수 있습니다.
문의사항은 보안팀으로 연락 부탁드립니다.

감사합니다.`,
        author: '보안팀 정보안',
        targetAudience: mockConsultants,
        requireReadConfirmation: true,
      },
    ];
  }

  private getTasksFromStorage(): Task[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const tasks = JSON.parse(data) as unknown[];
        return tasks.map(task => this.migrateTask(task));
      } else {
        const initialTasks = this.getInitialMockTasks();
        this.saveTasksToStorage(initialTasks);
        return initialTasks;
      }
    } catch {
      return [];
    }
  }

  private saveTasksToStorage(tasks: Task[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    } catch {
      // Storage error
    }
  }

  /**
   * Filter tasks visible to this user:
   * - Personal tasks where ownerId matches this.userId
   * - Notices where userId is in targetAudience OR userId is the author's ownerId
   */
  private filterTasksForUser(tasks: Task[]): Task[] {
    return tasks.filter(task => {
      if (task.type === 'notice') {
        // User can see a notice if they are in the targetAudience
        const isInAudience = task.targetAudience?.some(
          s => s.consultantId === this.userId
        );
        // Or if the user is the owner (author) of the notice
        const isAuthor = task.ownerId === this.userId;
        return isInAudience || isAuthor;
      }
      // Personal tasks: only visible to owner
      return task.ownerId === this.userId;
    });
  }

  // ── ITaskApi implementation ───────────────────────────────────────────

  async getTasks(): Promise<Task[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getTasksFromStorage();
        const updatedTasks = tasks.map(task => ({
          ...task,
          status: this.calculateTaskStatus(task.scheduledDate, task.deadline, task.status),
        }));

        if (JSON.stringify(tasks) !== JSON.stringify(updatedTasks)) {
          this.saveTasksToStorage(updatedTasks);
        }

        resolve(this.filterTasksForUser(updatedTasks));
      }, 50);
    });
  }

  async getTaskById(id: string): Promise<Task | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getTasksFromStorage();
        const task = tasks.find(t => t.id === id);
        resolve(task || null);
      }, 50);
    });
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getTasksFromStorage();
        const today = new Date().toISOString().split('T')[0];
        const scheduledDate = input.scheduledDate && input.scheduledDate.trim() !== '' ? input.scheduledDate : today;
        const deadline = input.deadline || null;
        const createdAt = Date.now();
        const parentTasks = tasks.filter(t => !t.parentId);
        const minOrder = parentTasks.length > 0 ? Math.min(...parentTasks.map(t => t.order)) : 0;

        const newTask: Task = {
          id: `task_${createdAt}_${Math.random().toString(36).substr(2, 9)}`,
          ownerId: this.userId,
          type: input.type,
          title: input.title,
          description: input.description || '',
          scheduledDate,
          deadline,
          status: this.calculateTaskStatus(scheduledDate, deadline, 'pending'),
          liked: false,
          pinned: false,
          pinnedAt: null,
          backgroundColor: input.backgroundColor || null,
          parentId: input.parentId || null,
          roomId: input.roomId || null,
          messageId: input.messageId ?? null,
          order: input.parentId ? createdAt : minOrder - 1,
          createdAt,
          completedAt: null,
        };

        tasks.unshift(newTask);
        this.saveTasksToStorage(tasks);
        this.emitTasksUpdated();
        resolve(newTask);
      }, 50);
    });
  }

  async updateTask(input: UpdateTaskInput): Promise<Task | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getTasksFromStorage();
        const index = tasks.findIndex(t => t.id === input.id);

        if (index === -1) {
          resolve(null);
          return;
        }

        const updatedTask = {
          ...tasks[index],
          ...input,
        };

        if (input.scheduledDate !== undefined || input.deadline !== undefined) {
          updatedTask.status = this.calculateTaskStatus(
            updatedTask.scheduledDate,
            updatedTask.deadline,
            updatedTask.status
          );
        }

        if (input.status === 'completed' && tasks[index].status !== 'completed') {
          updatedTask.completedAt = Date.now();
        } else if (input.status !== 'completed' && tasks[index].status === 'completed') {
          updatedTask.completedAt = null;
        }

        tasks[index] = updatedTask;
        this.saveTasksToStorage(tasks);
        this.emitTasksUpdated();
        resolve(updatedTask);
      }, 50);
    });
  }

  async deleteTask(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getTasksFromStorage();
        const filteredTasks = tasks.filter(t => t.id !== id && t.parentId !== id);

        if (tasks.length === filteredTasks.length) {
          resolve(false);
          return;
        }

        this.saveTasksToStorage(filteredTasks);
        this.emitTasksUpdated();
        resolve(true);
      }, 50);
    });
  }

  async toggleTaskCompletion(id: string): Promise<Task | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getTasksFromStorage();
        const index = tasks.findIndex(t => t.id === id);

        if (index === -1) {
          resolve(null);
          return;
        }

        const task = tasks[index];
        const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';

        const updatedTask: Task = {
          ...task,
          status: newStatus,
          completedAt: newStatus === 'completed' ? Date.now() : null,
        };

        if (newStatus !== 'completed') {
          updatedTask.status = this.calculateTaskStatus(
            updatedTask.scheduledDate,
            updatedTask.deadline,
            newStatus
          );
        }

        tasks[index] = updatedTask;
        this.saveTasksToStorage(tasks);
        this.emitTasksUpdated();
        resolve(updatedTask);
      }, 50);
    });
  }

  async toggleTaskLike(id: string): Promise<Task | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getTasksFromStorage();
        const index = tasks.findIndex(t => t.id === id);

        if (index === -1) {
          resolve(null);
          return;
        }

        const updatedTask: Task = {
          ...tasks[index],
          liked: !tasks[index].liked,
        };

        tasks[index] = updatedTask;
        this.saveTasksToStorage(tasks);
        this.emitTasksUpdated();
        resolve(updatedTask);
      }, 50);
    });
  }

  async toggleTaskPin(id: string): Promise<Task | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getTasksFromStorage();
        const index = tasks.findIndex(t => t.id === id);

        if (index === -1) {
          resolve(null);
          return;
        }

        const newPinned = !tasks[index].pinned;
        const updatedTask: Task = {
          ...tasks[index],
          pinned: newPinned,
          pinnedAt: newPinned ? Date.now() : null,
        };

        tasks[index] = updatedTask;
        this.saveTasksToStorage(tasks);
        this.emitTasksUpdated();
        resolve(updatedTask);
      }, 50);
    });
  }

  async getTaskStats(): Promise<TaskStats> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const tasks = await this.getTasks();

        const stats: TaskStats = {
          notice: tasks.filter(t => t.type === 'notice' && t.status !== 'completed' && !t.isRead).length,
          pending: tasks.filter(t => t.status === 'pending' && t.type !== 'notice').length,
          delayed: tasks.filter(t => t.status === 'delayed' && t.type !== 'notice').length,
          liked: tasks.filter(t => t.liked && t.status !== 'completed' && t.type !== 'notice').length,
          completed: tasks.filter(t => t.status === 'completed').length,
        };

        resolve(stats);
      }, 50);
    });
  }

  async reorderTasks(reorderedTasks: Task[]): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getTasksFromStorage();
        const taskMap = new Map(tasks.map(t => [t.id, t]));

        reorderedTasks.forEach((task, index) => {
          const existing = taskMap.get(task.id);
          if (existing) {
            existing.order = index;
          }
        });

        this.saveTasksToStorage(Array.from(taskMap.values()));
        this.emitTasksUpdated();
        resolve();
      }, 50);
    });
  }

  async toggleNoticeRead(id: string): Promise<Task | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getTasksFromStorage();
        const index = tasks.findIndex(t => t.id === id);

        if (index === -1) {
          resolve(null);
          return;
        }

        const task = tasks[index];
        const newReadStatus = !task.isRead;

        let updatedAudience = task.targetAudience;
        if (updatedAudience) {
          updatedAudience = updatedAudience.map(s => {
            if (s.consultantId === this.userId) {
              return {
                ...s,
                isRead: newReadStatus,
                readAt: newReadStatus ? Date.now() : null,
              };
            }
            return s;
          });
        }

        const updatedTask: Task = {
          ...task,
          isRead: newReadStatus,
          targetAudience: updatedAudience,
        };

        tasks[index] = updatedTask;
        this.saveTasksToStorage(tasks);
        this.emitTasksUpdated();
        resolve(updatedTask);
      }, 50);
    });
  }

  async createNotice(input: CreateNoticeInput): Promise<Task> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getTasksFromStorage();
        const today = new Date().toISOString().split('T')[0];
        const createdAt = Date.now();
        const parentTasks = tasks.filter(t => !t.parentId);
        const minOrder = parentTasks.length > 0 ? Math.min(...parentTasks.map(t => t.order)) : 0;

        const newNotice: Task = {
          id: `notice_${createdAt}_${Math.random().toString(36).substr(2, 9)}`,
          ownerId: this.userId,
          type: 'notice',
          title: input.title,
          description: input.title,
          scheduledDate: today,
          deadline: null,
          status: 'pending',
          liked: false,
          pinned: false,
          pinnedAt: null,
          backgroundColor: null,
          parentId: null,
          roomId: null,
          messageId: null,
          order: minOrder - 1,
          createdAt,
          completedAt: null,
          noticeContent: input.noticeContent,
          author: input.author,
          isRead: false,
          targetAudience: input.targetAudience,
          requireReadConfirmation: input.requireReadConfirmation,
        };

        tasks.unshift(newNotice);
        this.saveTasksToStorage(tasks);
        this.emitTasksUpdated();
        resolve(newNotice);
      }, 50);
    });
  }

  async updateNoticeReadStatus(
    noticeId: string,
    consultantId: string
  ): Promise<Task | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getTasksFromStorage();
        const index = tasks.findIndex(t => t.id === noticeId);

        if (index === -1) {
          resolve(null);
          return;
        }

        const task = tasks[index];
        if (task.type !== 'notice' || !task.targetAudience) {
          resolve(null);
          return;
        }

        const updatedAudience = task.targetAudience.map(status => {
          if (status.consultantId === consultantId) {
            return {
              ...status,
              isRead: true,
              readAt: Date.now(),
            };
          }
          return status;
        });

        const updatedTask: Task = {
          ...task,
          targetAudience: updatedAudience,
        };

        tasks[index] = updatedTask;
        this.saveTasksToStorage(tasks);
        this.emitTasksUpdated();
        resolve(updatedTask);
      }, 50);
    });
  }

  getNoticeReadStats(task: Task): { total: number; read: number; unread: number } {
    if (!task.targetAudience) {
      return { total: 0, read: 0, unread: 0 };
    }
    const total = task.targetAudience.length;
    const read = task.targetAudience.filter(s => s.isRead).length;
    return { total, read, unread: total - read };
  }

  async updateNotice(
    noticeId: string,
    updates: Partial<Pick<Task, 'title' | 'noticeContent' | 'targetAudience' | 'requireReadConfirmation'>>
  ): Promise<Task | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getTasksFromStorage();
        const index = tasks.findIndex(t => t.id === noticeId);

        if (index === -1) {
          resolve(null);
          return;
        }

        const updatedTask: Task = {
          ...tasks[index],
          ...updates,
          description: updates.title || tasks[index].title,
        };

        tasks[index] = updatedTask;
        this.saveTasksToStorage(tasks);
        this.emitTasksUpdated();
        resolve(updatedTask);
      }, 50);
    });
  }

  async resetTasksToInitial(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem(this.storageKey);
        const initialTasks = this.getInitialMockTasks();
        this.saveTasksToStorage(initialTasks);
        this.emitTasksUpdated();
        resolve();
      }, 50);
    });
  }

  onTasksUpdated(callback: () => void): () => void {
    return this.eventBus.on(TASKS_UPDATED_EVENT, callback);
  }
}
