const DB_NAME = "SpellDB";
const DB_VERSION = 1;
const DB_SPELLS_STORE_NAME = "spells";
const DB_INDEX_CLASSANDLEVEL = "classAndLevel";
const DB_INDEX_DOMAINANDLEVEL = "domainAndLevel";
const INITIAL_DATA_URL = process.env.REACT_APP_INITIAL_DATA_URL || "./spells.json";

type ClassSpellLevel = [string, number];

type DomainSpellLevel = [string, number];

type SpellSource = {
    rulebook: string;
    page: number;
};

type Spell = {
    dndtoolsUrl: string;
    id: string;
    name: string;
    source: SpellSource | null;
    description: string | null;
    classLevels: ClassSpellLevel[];
    domainLevels: DomainSpellLevel[];
    schools: string[];
    subschools: string[];
    descriptors: string[];
    components: string[];
    castingTime: string | null;
    range: string | null;
    area: string | null;
    target: string | null;
    effect: string | null;
    duration: string | null;
    savingThrow: string | null;
    spellResistance: string | null;
};

var _db: IDBDatabase | null = null;

function getDb() {
    if (_db != null) {
        return _db;
    } else {
        throw new Error("Database not initialised.");
    }
}

function putSpells(db: IDBDatabase, spells: Spell[]): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        const tr = db.transaction(DB_SPELLS_STORE_NAME, "readwrite");
        tr.onerror = (err) => reject(err);
    
        const os = tr.objectStore(DB_SPELLS_STORE_NAME);
        await Promise.all(spells.map(s => {
            return new Promise<void>((resolve) => {
                const putRequest = os.put(s);
                putRequest.onsuccess = e => resolve();
            });
        }));

        resolve();
    });
}

async function fetchSpells(db: IDBDatabase, ignoreCache: boolean) {
    const headers: any = {};
    if (ignoreCache) {
        headers["Cache-Control"] = "no-cache";
    }

    const response = await fetch(INITIAL_DATA_URL, { headers });

    if (response.ok) {
        const spells: Array<any> = await response.json();
        await putSpells(db, spells.map(s => {
            if (s.classLevels) {
                s.classLevels = s.classLevels.filter((v: any) => v != null).map((v: any) => {
                    return [v.class, v.level];
                });
            }
            if (s.domainLevels) {
                s.domainLevels = s.domainLevels.filter((v: any) => v != null).map((v: any) => {
                    return [v.domain, v.level];
                });
            }
            return s as Spell;
        }));
    } else if (response.status === 304) {
        // Not Modified
    } else {
        throw new Error(response.statusText);
    }
}

export async function initialise() : Promise<void> {
    return new Promise<void>((resolve, reject) => {
        let upgraded = false;

        function onBlocked(this: IDBOpenDBRequest, e: Event): any {
            reject(new Error("Database initialisation was blocked."));
        }
        
        function onError(this: IDBRequest<IDBDatabase>, e: Event): any {
            reject(new Error("Error initialising database."));
        }
        
        async function onSuccess(this: IDBRequest<IDBDatabase>, e: Event): Promise<any> {
            await fetchSpells(this.result, upgraded);
            _db = this.result;
            resolve();
        }
        
        function onUpgradeNeeded(this: IDBOpenDBRequest, e: IDBVersionChangeEvent) {
            // @ts-ignore result property does not exist
            const db: IDBDatabase = e.target.result;

            const objectStore = db.createObjectStore(DB_SPELLS_STORE_NAME, { keyPath: "name" });
            objectStore.createIndex(DB_INDEX_CLASSANDLEVEL, "classLevels", { multiEntry: true });
            objectStore.createIndex(DB_INDEX_DOMAINANDLEVEL, "domainLevels", { multiEntry: true });

            upgraded = true;
        }
        
        if (_db != null) {
            throw new Error("Already initialised!");
        }
    
        let dbOpenRequest = indexedDB.open(DB_NAME, DB_VERSION);
        dbOpenRequest.onblocked = onBlocked;
        dbOpenRequest.onerror = onError;
        dbOpenRequest.onsuccess = onSuccess;
        dbOpenRequest.onupgradeneeded = onUpgradeNeeded;    
    });
}

function readFromObjectStore<T>(objectStoreName: string, useStoreFn: (store: IDBObjectStore) => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const tr = getDb().transaction(objectStoreName);
        tr.onerror = e => reject(tr.error);

        const os = tr.objectStore(objectStoreName);
        const val = useStoreFn(os);
        resolve(val);
    });
}

type FindSpellFilter = null | {
    not?: {
        schools?: string[],
        descriptors?: string[]
    }
};

export function findSpells(casterClass: string, spellLevel: number, filter: FindSpellFilter) : Promise<Spell[]> {
    return readFromObjectStore(DB_SPELLS_STORE_NAME, os => {
        return new Promise<Spell[]>((resolve, reject) => {
            const key: ClassSpellLevel = [casterClass, spellLevel];
            const spells: Spell[] = [];

            os.index(DB_INDEX_CLASSANDLEVEL).openCursor(key).onsuccess = e => {
                // @ts-ignore possible null, unknown property
                const cursor: IDBCursorWithValue | null = e.target.result;

                if (cursor) {
                    const spell: Spell = cursor.value;
                    let includeSpell = true;

                    if (filter) {
                        if (filter.not) {
                            if (filter.not.descriptors) {
                                if (filter.not.descriptors.some(dsc => spell.descriptors.includes(dsc))) {
                                    includeSpell = false;
                                }
                            }
                            if (filter.not.schools) {
                                if (filter.not.schools.some(school => spell.schools.includes(school))) {
                                    includeSpell = false;
                                }
                            }
                        }
                    }

                    if (includeSpell) {
                        spells.push(spell);
                    }

                    cursor.continue();
                } else {
                    resolve(spells);
                }
            };
        });
    });
}

export function getSpellByName(spellName: string) : Promise<Spell> {
    return readFromObjectStore(DB_SPELLS_STORE_NAME, os => {
        return new Promise<Spell>((resolve, reject) => {
            const getRequest = os.get(spellName);
            getRequest.onsuccess = e => resolve(getRequest.result);
        });
    });
}

