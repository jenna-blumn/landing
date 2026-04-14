import { useState, useEffect, useCallback } from 'react';
import { SideTabConfig, OmsConnectionConfig, DEFAULT_SIDE_TAB_WIDTH, SIDE_TAB_COLORS, MIN_SIDE_TABS, MAX_SIDE_TABS } from '../types/sideTab';

const STORAGE_KEY = 'sideTabSettings';
const DRAWER_POSITION_KEY = 'sideTabDrawerVerticalOffset';
const REFERENCE_SETTINGS_KEY = 'referenceSettings';

const getColorForIndex = (index: number): string => {
  return SIDE_TAB_COLORS[index % SIDE_TAB_COLORS.length].value;
};

const createDefaultSlot = (id: number, colorIndex: number): SideTabConfig => ({
  id,
  tabId: null,
  linkedOmsId: null,
  omsConfig: null,
  isVisible: false,
  displayMode: 'drawer',
  width: DEFAULT_SIDE_TAB_WIDTH,
  color: getColorForIndex(colorIndex),
});

const loadReferenceSettings = (): { tabAssignments: Map<number, string>; omsAssignments: Map<number, string> } => {
  const tabAssignments = new Map<number, string>();
  const omsAssignments = new Map<number, string>();

  try {
    const saved = localStorage.getItem(REFERENCE_SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);

      if (parsed.tabs && Array.isArray(parsed.tabs)) {
        parsed.tabs.forEach((tab: { id: string; sideTabSlotId: number | null }) => {
          if (tab.sideTabSlotId !== null) {
            tabAssignments.set(tab.sideTabSlotId, tab.id);
          }
        });
      }

      if (parsed.omsList && Array.isArray(parsed.omsList)) {
        parsed.omsList.forEach((oms: { id: string; sideTabSlotId: number | null }) => {
          if (oms.sideTabSlotId !== null) {
            omsAssignments.set(oms.sideTabSlotId, oms.id);
          }
        });
      }
    }
  } catch (error) {
    console.error('Failed to load reference settings:', error);
  }

  return { tabAssignments, omsAssignments };
};

export const useSideTabManagement = () => {
  const [sideTabSlots, setSideTabSlots] = useState<SideTabConfig[]>(() => {
    const { tabAssignments, omsAssignments } = loadReferenceSettings();

    const allSlotIds = new Set<number>();
    tabAssignments.forEach((_, slotId) => allSlotIds.add(slotId));
    omsAssignments.forEach((_, slotId) => allSlotIds.add(slotId));

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          let slots = parsed.map((slot: Partial<SideTabConfig>, index: number) => ({
            ...createDefaultSlot(slot.id || index + 1, index),
            ...slot,
            displayMode: 'drawer' as const,
          }));

          slots = slots.map((slot: SideTabConfig) => {
            const assignedTabId = tabAssignments.get(slot.id);
            const assignedOmsId = omsAssignments.get(slot.id);

            if (assignedTabId) {
              return { ...slot, tabId: assignedTabId, linkedOmsId: null, omsConfig: null };
            } else if (assignedOmsId) {
              return { ...slot, tabId: null, linkedOmsId: assignedOmsId };
            } else {
              return { ...slot, tabId: null, linkedOmsId: null, omsConfig: null };
            }
          });

          allSlotIds.forEach(slotId => {
            if (!slots.find((s: SideTabConfig) => s.id === slotId)) {
              const newSlot = createDefaultSlot(slotId, slots.length);
              const assignedTabId = tabAssignments.get(slotId);
              const assignedOmsId = omsAssignments.get(slotId);

              if (assignedTabId) {
                newSlot.tabId = assignedTabId;
              } else if (assignedOmsId) {
                newSlot.linkedOmsId = assignedOmsId;
              }

              slots.push(newSlot);
            }
          });

          slots.sort((a: SideTabConfig, b: SideTabConfig) => a.id - b.id);

          return slots;
        }
      }
    } catch (error) {
      console.error('Failed to load side tab settings:', error);
    }

    if (allSlotIds.size > 0) {
      const slots: SideTabConfig[] = [];
      Array.from(allSlotIds).sort((a, b) => a - b).forEach((slotId, index) => {
        const newSlot = createDefaultSlot(slotId, index);
        const assignedTabId = tabAssignments.get(slotId);
        const assignedOmsId = omsAssignments.get(slotId);

        if (assignedTabId) {
          newSlot.tabId = assignedTabId;
        } else if (assignedOmsId) {
          newSlot.linkedOmsId = assignedOmsId;
        }

        slots.push(newSlot);
      });
      return slots;
    }

    return [createDefaultSlot(1, 0)];
  });

  const [drawerVerticalOffset, setDrawerVerticalOffset] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(DRAWER_POSITION_KEY);
      if (saved) {
        const value = parseFloat(saved);
        return Math.max(300, Math.min(window.innerHeight - 100, value));
      }
    } catch (error) {
      console.error('Failed to load drawer position:', error);
    }
    return Math.max(300, window.innerHeight - 300);
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sideTabSlots));
    } catch (error) {
      console.error('Failed to save side tab settings:', error);
    }
  }, [sideTabSlots]);

  useEffect(() => {
    try {
      localStorage.setItem(DRAWER_POSITION_KEY, drawerVerticalOffset.toString());
    } catch (error) {
      console.error('Failed to save drawer position:', error);
    }
  }, [drawerVerticalOffset]);

  const assignTabToSlot = useCallback((slotId: number, tabId: string) => {
    setSideTabSlots(prev => {
      const newSlots = prev.map(slot => {
        if (slot.tabId === tabId && slot.id !== slotId) {
          return { ...slot, tabId: null, isVisible: false };
        }
        if (slot.id === slotId) {
          return { ...slot, tabId, linkedOmsId: null, omsConfig: null, isVisible: true };
        }
        return slot;
      });
      return newSlots;
    });
  }, []);

  const assignOmsToSlot = useCallback((slotId: number, omsId: string, config: OmsConnectionConfig) => {
    setSideTabSlots(prev => {
      const newSlots = prev.map(slot => {
        if (slot.linkedOmsId === omsId && slot.id !== slotId) {
          return { ...slot, linkedOmsId: null, omsConfig: null, isVisible: false };
        }
        if (slot.id === slotId) {
          return { ...slot, tabId: null, linkedOmsId: omsId, omsConfig: config, isVisible: true };
        }
        return slot;
      });
      return newSlots;
    });
  }, []);

  const removeOmsFromSlot = useCallback((slotId: number) => {
    setSideTabSlots(prev =>
      prev.map(slot =>
        slot.id === slotId ? { ...slot, linkedOmsId: null, omsConfig: null, isVisible: false } : slot
      )
    );
  }, []);

  const updateOmsConfig = useCallback((slotId: number, config: OmsConnectionConfig) => {
    setSideTabSlots(prev =>
      prev.map(slot =>
        slot.id === slotId ? { ...slot, omsConfig: config } : slot
      )
    );
  }, []);

  const getOmsLocation = useCallback((omsId: string): { location: 'none' | 'slot', slotId?: number } => {
    const slot = sideTabSlots.find(s => s.linkedOmsId === omsId);
    if (slot) {
      return { location: 'slot', slotId: slot.id };
    }
    return { location: 'none' };
  }, [sideTabSlots]);

  const removeTabFromSlot = useCallback((slotId: number) => {
    setSideTabSlots(prev =>
      prev.map(slot =>
        slot.id === slotId ? { ...slot, tabId: null, isVisible: false } : slot
      )
    );
  }, []);

  const toggleSlotVisibility = useCallback((slotId: number) => {
    setSideTabSlots(prev =>
      prev.map(slot => {
        if (slot.id === slotId) {
          return { ...slot, isVisible: !slot.isVisible };
        } else {
          return { ...slot, isVisible: false };
        }
      })
    );
  }, []);

  const updateSlotDisplayMode = useCallback((slotId: number, displayMode: 'drawer') => {
    setSideTabSlots(prev =>
      prev.map(slot =>
        slot.id === slotId ? { ...slot, displayMode } : slot
      )
    );
  }, []);

  const updateSlotWidth = useCallback((slotId: number, width: number) => {
    setSideTabSlots(prev =>
      prev.map(slot =>
        slot.id === slotId ? { ...slot, width } : slot
      )
    );
  }, []);

  const updateSlotColor = useCallback((slotId: number, color: string) => {
    setSideTabSlots(prev =>
      prev.map(slot =>
        slot.id === slotId ? { ...slot, color } : slot
      )
    );
  }, []);

  const getTabLocation = useCallback((tabId: string): { location: 'main' | 'slot', slotId?: number } => {
    const slot = sideTabSlots.find(s => s.tabId === tabId);
    if (slot) {
      return { location: 'slot', slotId: slot.id };
    }
    return { location: 'main' };
  }, [sideTabSlots]);

  const closeSlot = useCallback((slotId: number) => {
    setSideTabSlots(prev =>
      prev.map(slot =>
        slot.id === slotId ? { ...slot, isVisible: false } : slot
      )
    );
  }, []);

  const addSlot = useCallback(() => {
    setSideTabSlots(prev => {
      if (prev.length >= MAX_SIDE_TABS) return prev;

      const maxId = Math.max(...prev.map(s => s.id), 0);
      const newSlot = createDefaultSlot(maxId + 1, prev.length);
      return [...prev, newSlot];
    });
  }, []);

  const removeSideTabSlot = useCallback((slotId: number) => {
    setSideTabSlots(prev => {
      if (prev.length <= MIN_SIDE_TABS) return prev;
      return prev.filter(slot => slot.id !== slotId);
    });
  }, []);

  const canAddSlot = sideTabSlots.length < MAX_SIDE_TABS;
  const canRemoveSlot = sideTabSlots.length > MIN_SIDE_TABS;

  interface ReferenceSettingsInput {
    tabs: Array<{ id: string; sideTabSlotId: number | null }>;
    omsList: Array<{ id: string; sideTabSlotId: number | null }>;
  }

  const syncWithReferenceSettings = useCallback((settings: ReferenceSettingsInput): { pendingOmsConnections: Array<{ slotId: number; omsId: string }> } => {
    const pendingOmsConnections: Array<{ slotId: number; omsId: string }> = [];

    const tabAssignments = new Map<number, string>();
    const omsAssignments = new Map<number, string>();

    settings.tabs.forEach(tab => {
      if (tab.sideTabSlotId !== null) {
        tabAssignments.set(tab.sideTabSlotId, tab.id);
      }
    });

    settings.omsList.forEach(oms => {
      if (oms.sideTabSlotId !== null) {
        omsAssignments.set(oms.sideTabSlotId, oms.id);
      }
    });

    const allRequiredSlotIds = new Set<number>();
    tabAssignments.forEach((_, slotId) => allRequiredSlotIds.add(slotId));
    omsAssignments.forEach((_, slotId) => allRequiredSlotIds.add(slotId));

    setSideTabSlots(prev => {
      let newSlots = [...prev];

      allRequiredSlotIds.forEach(slotId => {
        if (!newSlots.find(s => s.id === slotId)) {
          const newSlot = createDefaultSlot(slotId, newSlots.length);
          newSlots.push(newSlot);
        }
      });

      newSlots = newSlots.map(slot => {
        const assignedTabId = tabAssignments.get(slot.id);
        const assignedOmsId = omsAssignments.get(slot.id);

        if (assignedTabId) {
          return { ...slot, tabId: assignedTabId, linkedOmsId: null, omsConfig: null };
        } else if (assignedOmsId) {
          if (!slot.omsConfig || slot.linkedOmsId !== assignedOmsId) {
            pendingOmsConnections.push({ slotId: slot.id, omsId: assignedOmsId });
          }
          return { ...slot, tabId: null, linkedOmsId: assignedOmsId };
        } else {
          const wasLinkedToTab = tabAssignments.size > 0 || omsAssignments.size > 0;
          if (wasLinkedToTab) {
            return { ...slot, tabId: null, linkedOmsId: null, omsConfig: null };
          }
          return slot;
        }
      });

      newSlots.sort((a, b) => a.id - b.id);

      return newSlots;
    });

    return { pendingOmsConnections };
  }, []);

  return {
    sideTabSlots,
    assignTabToSlot,
    assignOmsToSlot,
    removeTabFromSlot,
    removeOmsFromSlot,
    updateOmsConfig,
    toggleSlotVisibility,
    updateSlotDisplayMode,
    updateSlotWidth,
    updateSlotColor,
    getTabLocation,
    getOmsLocation,
    closeSlot,
    drawerVerticalOffset,
    setDrawerVerticalOffset,
    addSlot,
    removeSideTabSlot,
    canAddSlot,
    canRemoveSlot,
    syncWithReferenceSettings,
  };
};
