import {
  ReferenceSettings,
  ReferenceTabConfig,
  DEFAULT_TABS,
  DEFAULT_OMS_LIST,
  DEFAULT_COMPOSITE_TAB,
  COMPOSITE_TAB_ID,
  CompositeCardId,
  COMPOSITE_CARD_CATALOG,
} from '../types';

const STORAGE_KEY = 'referenceSettings';

let cachedSettings: ReferenceSettings | null = null;

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) cachedSettings = null;
  });
}

const REMOVED_TAB_IDS = ['task'];

const deduplicateCardOrder = (cardOrder: CompositeCardId[]): CompositeCardId[] => {
  const validIds = new Set(COMPOSITE_CARD_CATALOG.map(c => c.id));
  const seen = new Set<CompositeCardId>();
  return cardOrder.filter(id => {
    if (!validIds.has(id) || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const migrateCompositeTab = (parsed: any): ReferenceSettings['compositeTab'] => {
  if (parsed.compositeTab) {
    return {
      ...DEFAULT_COMPOSITE_TAB,
      ...parsed.compositeTab,
      cardOrder: deduplicateCardOrder(parsed.compositeTab.cardOrder || []),
    };
  }
  return { ...DEFAULT_COMPOSITE_TAB };
};

const ensureCompositeTabEntry = (tabs: ReferenceTabConfig[], compositeTab: ReferenceSettings['compositeTab']): ReferenceTabConfig[] => {
  const hasCompositeTab = tabs.some(t => t.id === COMPOSITE_TAB_ID);
  if (compositeTab.enabled && !hasCompositeTab) {
    const maxOrder = Math.max(...tabs.map(t => t.order), -1);
    return [
      ...tabs,
      {
        id: COMPOSITE_TAB_ID,
        name: compositeTab.name,
        order: maxOrder + 1,
        leftSecondary: false,
        mainReference: true,
        rightSecondary: false,
        sideTabSlotId: null,
        isCustom: true,
        customTabKind: 'composite',
      },
    ];
  }
  return tabs;
};

const loadFromStorage = (): ReferenceSettings => {
  if (cachedSettings) return cachedSettings;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const tabs = (parsed.tabs || DEFAULT_TABS)
        .filter((tab: ReferenceTabConfig) => !REMOVED_TAB_IDS.includes(tab.id))
        .map((tab: ReferenceTabConfig) => {
          const { ...rest } = tab;
          return rest;
        });
      const compositeTab = migrateCompositeTab(parsed);
      const migratedTabs = ensureCompositeTabEntry(tabs, compositeTab);
      cachedSettings = {
        tabs: migratedTabs,
        omsList: parsed.omsList || DEFAULT_OMS_LIST,
        rnbVisible: parsed.rnbVisible !== undefined ? parsed.rnbVisible : true,
        taskButton: parsed.taskButton || undefined,
        compositeTab,
      };
      return cachedSettings;
    }
  } catch (error) {
    console.error('Failed to load reference settings:', error);
  }

  cachedSettings = {
    tabs: [...DEFAULT_TABS],
    omsList: [...DEFAULT_OMS_LIST],
    rnbVisible: true,
    compositeTab: { ...DEFAULT_COMPOSITE_TAB },
  };
  return cachedSettings;
};

const saveToStorage = (settings: ReferenceSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    cachedSettings = settings;
  } catch (error) {
    console.error('Failed to save reference settings:', error);
  }
};

export const getReferenceSettings = async (): Promise<ReferenceSettings> => {
  return loadFromStorage();
};

export const updateTabSideTabSlot = async (
  tabId: string,
  slotId: number | null
): Promise<ReferenceSettings> => {
  const settings = loadFromStorage();

  const updatedTabs = settings.tabs.map(tab => {
    if (tab.sideTabSlotId === slotId && slotId !== null) {
      return { ...tab, sideTabSlotId: null };
    }
    if (tab.id === tabId) {
      if (slotId !== null) {
        return {
          ...tab,
          sideTabSlotId: slotId,
          leftSecondary: false,
          mainReference: false,
          rightSecondary: false,
        };
      }
      return {
        ...tab,
        sideTabSlotId: null,
        mainReference: true,
      };
    }
    return tab;
  });

  const updatedOmsList = settings.omsList.map(oms => {
    if (oms.sideTabSlotId === slotId && slotId !== null) {
      return { ...oms, sideTabSlotId: null };
    }
    return oms;
  });

  const updatedSettings = { ...settings, tabs: updatedTabs, omsList: updatedOmsList };
  saveToStorage(updatedSettings);
  return updatedSettings;
};

export const updateOmsSideTabSlot = async (
  omsId: string,
  slotId: number | null
): Promise<ReferenceSettings> => {
  const settings = loadFromStorage();

  const updatedTabs = settings.tabs.map(tab => {
    if (tab.sideTabSlotId === slotId && slotId !== null) {
      return { ...tab, sideTabSlotId: null };
    }
    return tab;
  });

  const updatedOmsList = settings.omsList.map(oms => {
    if (oms.sideTabSlotId === slotId && slotId !== null && oms.id !== omsId) {
      return { ...oms, sideTabSlotId: null };
    }
    if (oms.id === omsId) {
      return { ...oms, sideTabSlotId: slotId };
    }
    return oms;
  });

  const updatedSettings = { ...settings, tabs: updatedTabs, omsList: updatedOmsList };
  saveToStorage(updatedSettings);
  return updatedSettings;
};

export const saveSettings = async (settings: ReferenceSettings): Promise<ReferenceSettings> => {
  saveToStorage(settings);
  return settings;
};

export const updateTaskButtonFixedHeight = async (height: number): Promise<void> => {
  const settings = loadFromStorage();
  const updatedSettings = {
    ...settings,
    taskButton: {
      displayMode: settings.taskButton?.displayMode || 'floating' as const,
      fixedDrawerHeight: height,
    },
  };
  saveToStorage(updatedSettings);
};

export const clearCache = (): void => {
  cachedSettings = null;
};
