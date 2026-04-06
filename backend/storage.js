const STORAGE_KEY = 'todo_list_data';
 
function saveToLocalStorage(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('Error al guardar en localStorage:', e);
    }
}

function loadFromLocalStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        console.error('Error al leer localStorage:', e);
        return null;
    }
}
 
function clearLocalStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Error al limpiar localStorage:', e);
    }
}
 