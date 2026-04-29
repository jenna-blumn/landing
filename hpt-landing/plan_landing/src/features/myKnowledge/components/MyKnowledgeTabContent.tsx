import React, { useState, useEffect } from 'react';
import {
  Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Input, Textarea, Icon,
  SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@blumnai-studio/blumnai-design-system';
import { KnowledgeFolder, KnowledgeItem, CreateKnowledgeFolderInput, CreateKnowledgeItemInput, UpdateKnowledgeItemInput } from '../types';
import {
  getFolders,
  getItems,
  searchItems,
  createFolder,
  createItem,
  updateItem,
  deleteItem,
  deleteFolder,
  toggleBookmark,
} from '../api/myKnowledgeApi';

type ViewMode = 'folders' | 'bookmarks' | 'search';

const MyKnowledgeTabContent: React.FC = () => {
  const [folders, setFolders] = useState<KnowledgeFolder[]>([]);
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [displayItems, setDisplayItems] = useState<KnowledgeItem[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('folders');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderParentId, setNewFolderParentId] = useState<string | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);

  const loadData = async () => {
    const [loadedFolders, loadedItems] = await Promise.all([
      getFolders(),
      getItems(),
    ]);
    setFolders(loadedFolders);
    setItems(loadedItems);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (viewMode === 'folders') {
      if (selectedFolderId) {
        const filtered = items.filter(item => item.folderId === selectedFolderId);
        setDisplayItems(filtered);
      } else {
        setDisplayItems([]);
      }
    } else if (viewMode === 'bookmarks') {
      const bookmarked = items.filter(item => item.isBookmarked);
      setDisplayItems(bookmarked);
    }
  }, [selectedFolderId, items, viewMode]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setViewMode('search');
      const results = await searchItems(query);
      setDisplayItems(results);
    } else {
      setViewMode('folders');
      setDisplayItems([]);
    }
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const selectFolder = (folderId: string | null) => {
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    } else {
      setSelectedFolderId(folderId);
    }
    setViewMode('folders');
    setSearchQuery('');
  };

  const showBookmarks = () => {
    setViewMode('bookmarks');
    setSearchQuery('');
    setSelectedFolderId(null);
  };

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) return;

    const input: CreateKnowledgeFolderInput = {
      name: newFolderName,
      parentId: newFolderParentId,
    };

    await createFolder(input);
    await loadData();
    setIsAddFolderModalOpen(false);
    setNewFolderName('');
    setNewFolderParentId(null);
  };

  const handleToggleBookmark = async (itemId: string) => {
    await toggleBookmark(itemId);
    await loadData();
  };

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('이 지식을 삭제하시겠습니까?')) {
      await deleteItem(itemId);
      await loadData();
      setSelectedItem(null);
      setIsItemModalOpen(false);
    }
  };

  const getFolderDepth = (folderId: string): number => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder || !folder.parentId) return 0;
    return 1 + getFolderDepth(folder.parentId);
  };

  const handleDeleteFolder = async () => {
    if (!folderToDelete) return;

    const itemsInFolder = items.filter(item => item.folderId === folderToDelete);
    const subFolders = folders.filter(f => f.parentId === folderToDelete);

    if (itemsInFolder.length > 0 || subFolders.length > 0) {
      alert('하위 폴더나 지식이 있는 폴더는 삭제할 수 없습니다.');
      setFolderToDelete(null);
      return;
    }

    await deleteFolder(folderToDelete);
    await loadData();
    setFolderToDelete(null);
    setIsDeleteMode(false);
  };

  const getFolderItems = (parentId: string | null, level: number = 0): React.ReactNode[] => {
    if (level >= 3) return [];

    const childFolders = folders.filter(f => f.parentId === parentId);
    if (childFolders.length === 0) return [];

    return childFolders.flatMap(folder => {
      const hasChildren = folders.some(f => f.parentId === folder.id) && level < 2;
      const isExpanded = expandedFolders.has(folder.id);
      const isSelected = selectedFolderId === folder.id;
      const folderItems = items.filter(item => item.folderId === folder.id);

      const node = (
        <SidebarMenuSubItem key={folder.id} className="flex items-center">
          <SidebarMenuSubButton
            isActive={isSelected}
            onClick={() => selectFolder(folder.id)}
            size="sm"
            className="flex-1 min-w-0"
            style={{ paddingLeft: `${level * 16 + 8}px` }}
          >
            {hasChildren ? (
              <span
                onClick={(e) => { e.stopPropagation(); toggleFolder(folder.id); }}
                className="flex-shrink-0"
              >
                <Icon iconType={['arrows', isExpanded ? 'arrow-down-s' : 'arrow-right-s']} size={16} />
              </span>
            ) : (
              <span className="w-4 flex-shrink-0" />
            )}
            <Icon iconType={['document', 'folder']} size={16} />
            <span className="truncate">{folder.name}</span>
          </SidebarMenuSubButton>
          <span className="text-xs text-gray-400 flex-shrink-0 min-w-[20px] text-right pr-1">{folderItems.length}</span>
          {isDeleteMode && (
            <Button
              variant="iconOnly"
              buttonStyle="ghost"
              size="2xs"
              onClick={(e) => { e.stopPropagation(); setFolderToDelete(folder.id); }}
              title="폴더 삭제"
              className="flex-shrink-0 text-red-500 hover:text-red-700"
              leadIcon={<Icon iconType={['system', 'delete-bin']} size={14} />}
            />
          )}
        </SidebarMenuSubItem>
      );

      const children = hasChildren && isExpanded ? getFolderItems(folder.id, level + 1) : [];
      return [node, ...children];
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-3 border-b border-gray-200">
        <Input
          placeholder="내 지식 검색..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          leadIcon={['system', 'search']}
          size="sm"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <SidebarProvider defaultOpen className="!min-h-0 !block px-5 py-3 space-y-1">
          <SidebarMenu>
            <SidebarMenuItem
              icon={['system', 'star']}
              label="북마크한 지식"
              badge={items.filter(item => item.isBookmarked).length}
              isActive={viewMode === 'bookmarks'}
              onClick={showBookmarks}
            />
          </SidebarMenu>

          <div className="pt-3">
            <div className="flex items-center justify-between py-1.5">
              <span className="text-xs font-semibold text-gray-500 uppercase">내 지식</span>
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => {
                    if (selectedFolderId) {
                      const depth = getFolderDepth(selectedFolderId);
                      if (depth >= 2) {
                        alert('폴더는 최대 3단계까지만 생성할 수 있습니다.');
                        return;
                      }
                    }
                    setNewFolderParentId(selectedFolderId);
                    setIsAddFolderModalOpen(true);
                  }}
                  variant="iconOnly"
                  buttonStyle="ghostMuted"
                  size="2xs"
                  leadIcon={<Icon iconType={['document', 'folder-add']} size={16} />}
                  title="폴더 추가"
                />
                <Button
                  onClick={() => setIsDeleteMode(!isDeleteMode)}
                  variant="iconOnly"
                  buttonStyle={isDeleteMode ? 'ghost' : 'ghostMuted'}
                  colorOverride={isDeleteMode ? 'red' : undefined}
                  size="2xs"
                  leadIcon={<Icon iconType={['system', 'delete-bin']} size={16} />}
                  title={isDeleteMode ? '삭제 모드 종료' : '폴더 삭제'}
                />
              </div>
            </div>
            <SidebarMenuSub>
              {getFolderItems(null)}
            </SidebarMenuSub>
          </div>
        </SidebarProvider>

        {displayItems.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">
                {viewMode === 'bookmarks' && '북마크한 지식'}
                {viewMode === 'search' && '검색 결과'}
                {viewMode === 'folders' && '지식 목록'}
              </h3>
              {viewMode === 'folders' && selectedFolderId && (
                <Button
                  onClick={() => {
                    setSelectedItem(null);
                    setIsItemModalOpen(true);
                  }}
                  variant="iconOnly"
                  buttonStyle="ghost"
                  colorOverride="blue"
                  size="2xs"
                  leadIcon={<Icon iconType={['system', 'add']} size={16} />}
                  title="추가"
                />
              )}
            </div>
            <div className="space-y-2">
              {displayItems.map(item => (
                <div
                  key={item.id}
                  className="p-2 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer group"
                  onClick={() => {
                    setSelectedItem(item);
                    setIsItemModalOpen(true);
                  }}
                >
                  <div className="flex items-start gap-2">
                    <Icon iconType={['document', 'file']} size={16} color="default-muted" className="flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.content}</p>
                      {item.tags.length > 0 && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {item.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleBookmark(item.id);
                      }}
                      variant="iconOnly"
                      buttonStyle="ghost"
                      size="2xs"
                      leadIcon={
                        <Icon
                          iconType={['system', 'star']}
                          size={16}
                          color={item.isBookmarked ? '#facc15' : '#d1d5db'}
                          isFill={item.isBookmarked}
                        />
                      }
                      className="flex-shrink-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isAddFolderModalOpen} onOpenChange={(open) => { if (!open) { setIsAddFolderModalOpen(false); setNewFolderName(''); setNewFolderParentId(null); } }}>
        <DialogContent width={448}>
          <DialogHeader>
            <DialogTitle>폴더 추가</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="폴더 이름"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            autoFocus
            size="sm"
          />
          <DialogFooter>
            <Button
              onClick={() => {
                setIsAddFolderModalOpen(false);
                setNewFolderName('');
                setNewFolderParentId(null);
              }}
              buttonStyle="ghost"
              size="md"
            >
              취소
            </Button>
            <Button
              onClick={handleAddFolder}
              buttonStyle="primary"
              size="md"
            >
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isItemModalOpen && (
        <ItemDetailModal
          item={selectedItem}
          folderId={selectedFolderId}
          onClose={() => {
            setIsItemModalOpen(false);
            setSelectedItem(null);
          }}
          onSave={async () => {
            await loadData();
          }}
          onDelete={handleDeleteItem}
        />
      )}

      <Dialog open={!!folderToDelete} onOpenChange={(open) => { if (!open) setFolderToDelete(null); }}>
        <DialogContent width={448}>
          <DialogHeader>
            <DialogTitle>폴더 삭제</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            이 폴더를 삭제하시겠습니까? 하위 폴더나 지식이 있는 경우 삭제할 수 없습니다.
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={() => setFolderToDelete(null)}
              buttonStyle="ghost"
              size="md"
            >
              취소
            </Button>
            <Button
              onClick={handleDeleteFolder}
              buttonStyle="destructive"
              size="md"
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ItemDetailModalProps {
  item: KnowledgeItem | null;
  folderId: string | null;
  onClose: () => void;
  onSave: () => void;
  onDelete: (itemId: string) => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  folderId,
  onClose,
  onSave,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(!item);
  const [formData, setFormData] = useState({
    title: item?.title || '',
    content: item?.content || '',
    tags: item?.tags || [] as string[],
  });

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    if (item) {
      const input: UpdateKnowledgeItemInput = {
        id: item.id,
        title: formData.title,
        content: formData.content,
        tags: formData.tags,
      };
      await updateItem(input);
    } else {
      const input: CreateKnowledgeItemInput = {
        title: formData.title,
        content: formData.content,
        folderId,
        tags: formData.tags,
      };
      await createItem(input);
    }

    onSave();
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent width={672} className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? (isEditing ? '지식 수정' : '지식 상세') : '지식 추가'}
          </DialogTitle>
        </DialogHeader>

        {isEditing ? (
          <div className="space-y-4">
            <Input
              label="제목"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="제목 입력"
              size="sm"
            />
            <Textarea
              label="내용"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="내용 입력"
              minRows={10}
              resize="none"
            />
            <Input
              variant="tags"
              label="태그"
              tags={formData.tags}
              onTagsChange={(tags) => setFormData({ ...formData, tags })}
              placeholder="태그 입력 후 Enter"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{item?.title}</h3>
            </div>
            <div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{item?.content}</p>
            </div>
            {item?.tags && item.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <DialogFooter className="justify-between">
          {item && !isEditing && (
            <>
              <Button
                onClick={() => onDelete(item.id)}
                buttonStyle="secondary"
                colorOverride="red"
                size="md"
                leadIcon={<Icon iconType={['system', 'delete-bin']} size={16} />}
              >
                삭제
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
                buttonStyle="primary"
                size="md"
                leadIcon={<Icon iconType={['design', 'edit']} size={16} />}
              >
                수정
              </Button>
            </>
          )}
          {isEditing && (
            <>
              <div className="flex-1" />
              <Button
                onClick={() => {
                  if (item) {
                    setIsEditing(false);
                    setFormData({
                      title: item.title,
                      content: item.content,
                      tags: item.tags,
                    });
                  } else {
                    onClose();
                  }
                }}
                buttonStyle="ghost"
                size="md"
              >
                취소
              </Button>
              <Button
                onClick={handleSave}
                buttonStyle="primary"
                size="md"
              >
                저장
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MyKnowledgeTabContent;
