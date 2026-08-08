const STORAGE_KEY = 'star-seeker-storage';
const STORAGE_VERSION = 1;

const EMPTY_STORAGE = {
  version: STORAGE_VERSION,
  profile: {
    codename: 'N03L',
    tutorialCompleted: false,
    archiveKeywords: [],
    discoveredCharacters: [],
  },
  activeSave: null,
};

function cloneEmptyStorage() {
  return {
    version: EMPTY_STORAGE.version,
    profile: { ...EMPTY_STORAGE.profile },
    activeSave: null,
  };
}

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneEmptyStorage();

    const parsed = JSON.parse(raw);
    return {
      version: STORAGE_VERSION,
      profile: {
        ...EMPTY_STORAGE.profile,
        ...(parsed.profile || {}),
        archiveKeywords: Array.isArray(parsed.profile?.archiveKeywords)
          ? parsed.profile.archiveKeywords
          : [],
        discoveredCharacters: Array.isArray(parsed.profile?.discoveredCharacters)
          ? parsed.profile.discoveredCharacters
          : [],
      },
      activeSave: parsed.activeSave || null,
    };
  } catch (error) {
    console.warn('저장 데이터를 읽을 수 없습니다. 새 게임으로 시작합니다.', error);
    return cloneEmptyStorage();
  }
}

function writeStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn('저장 데이터를 기록할 수 없습니다.', error);
    return false;
  }
}

export function getProfile() {
  return readStorage().profile;
}

export function isTutorialCompleted() {
  return getProfile().tutorialCompleted === true;
}

export function getCodename() {
  return getProfile().codename || 'N03L';
}

export function saveCodename(codename) {
  if (typeof codename !== 'string') return false;

  const normalized = codename.trim();
  if (!normalized || normalized.length > 24) return false;

  updateProfile({ codename: normalized });
  return true;
}

export function updateProfile(patch) {
  const data = readStorage();
  data.profile = {
    ...data.profile,
    ...patch,
  };
  writeStorage(data);
  return data.profile;
}

export function markTutorialCompleted() {
  return updateProfile({ tutorialCompleted: true });
}

export function addArchiveKeyword(keyword) {
  const data = readStorage();
  if (!data.profile.archiveKeywords.includes(keyword)) {
    data.profile.archiveKeywords.push(keyword);
    writeStorage(data);
  }
}

export function getActiveSave() {
  return readStorage().activeSave;
}

export function hasActiveSave() {
  return getActiveSave() !== null;
}

export function saveActiveGame(save) {
  const data = readStorage();
  data.activeSave = {
    ...save,
    savedAt: new Date().toISOString(),
  };
  return writeStorage(data);
}

export function clearActiveSave() {
  const data = readStorage();
  data.activeSave = null;
  return writeStorage(data);
}