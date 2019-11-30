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

async function downloadInitialData(): Promise<Spell[]> {
    const response = await fetch(INITIAL_DATA_URL);
    if (response.ok) {
        const spells: Array<any> = await response.json();
        return spells.map(s => {
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
        });
    } else {
        throw new Error(response.statusText);
    }
}

var _db: IDBDatabase | null = null;

export async function initialise() : Promise<void> {
    return new Promise<void>((resolve, reject) => {
        let upgradePromise: (Promise<void> | undefined) = undefined;

        function onBlocked(this: IDBOpenDBRequest, e: Event): any {
            reject(new Error("Database initialisation was blocked."));
        }
        
        function onError(this: IDBRequest<IDBDatabase>, e: Event): any {
            reject(new Error("Error initialising database."));
        }
        
        function onSuccess(this: IDBRequest<IDBDatabase>, e: Event): any {
            _db = this.result;
            resolve(upgradePromise);
        }
        
        function onUpgradeNeeded(this: IDBOpenDBRequest, e: IDBVersionChangeEvent) {
            upgradePromise = new Promise((resolve, reject) => {
                // @ts-ignore result property does not exist
                const db: IDBDatabase = e.target.result;

                const objectStore = db.createObjectStore(DB_SPELLS_STORE_NAME, { keyPath: "name" });
                objectStore.createIndex(DB_INDEX_CLASSANDLEVEL, "classLevels", { multiEntry: true });
                objectStore.createIndex(DB_INDEX_DOMAINANDLEVEL, "domainLevels", { multiEntry: true });

                objectStore.transaction.oncomplete = async e => {
                    // Download spells and add them to the object store.
                    const spells: Spell[] = await downloadInitialData();

                    const tr = db.transaction(DB_SPELLS_STORE_NAME, "readwrite");
                    tr.onerror = (err) => reject(err);

                    const os = tr.objectStore(DB_SPELLS_STORE_NAME);
                    spells.forEach(s => os.put(s));

                    resolve();
                }; 
            });
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

function getDb() {
    if (_db != null) {
        return _db;
    } else {
        throw new Error("Database not initialised.");
    }
}

function readFromObjectStore<T>(objectStoreName: string, useStoreFn: (store: IDBObjectStore) => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const tr = getDb().transaction(objectStoreName);
        tr.onerror = (err) => reject(err);

        const os = tr.objectStore(objectStoreName);
        const val = useStoreFn(os);
        resolve(val);
    });
}

export async function getSpellsByCasterClassAndSpellLevel(casterClass: string, spellLevel: number) : Promise<Spell[]> {
    return readFromObjectStore(DB_SPELLS_STORE_NAME, os => {
        return new Promise((resolve, reject) => {
            const key: ClassSpellLevel = [casterClass, spellLevel];
            const getRequest = os.index(DB_INDEX_CLASSANDLEVEL).getAll(key);
            getRequest.onsuccess = e => resolve(getRequest.result);
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

