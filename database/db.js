export function openDatabase(dbName = 'myDatabase', version = 1) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'useremail' });
      }
      if (!db.objectStoreNames.contains('watchLists')) {
        db.createObjectStore('watchLists', { keyPath: 'useremail' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(`Error opening database: ${event.target.errorCode}`);
    };
  });
}


export function writeData(db, storeName, data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.add(data);

    request.onsuccess = () => {
      resolve({ "success": true, "message": `Data written successfully to ${storeName} ` });
    };

    request.onerror = (event) => {
      reject(`Error writing data: ${event.target.errorCode}`);
    };
  });
}


export function fetchData(db, storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.get(id);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(`Error fetching data: ${event.target.errorCode}`);
    };
  });
}

export function fetchAllData(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(`Error fetching all data: ${event.target.errorCode}`);
    };
  });
}

export function deleteData(db, storeName,  useremail, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.get(useremail);

    request.onsuccess = (event) => {
      const existingData = event.target.result;
      if (!existingData) {
        resolve(`No data to delete from ${storeName}`);
      } else {
        const existingItemIndex = existingData.lists.findIndex(item => item.id === id);
        existingData.lists.splice(existingItemIndex, 1)
        objectStore.put(existingData)
        resolve(`Data deleted successfully from ${storeName}`);
      }
    };

    request.onerror = (event) => {
      reject(`Error deleting data: ${event.target.errorCode}`);
    };
  });
}


export function writeOrUpdateData(db, storeName, payload) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.get(payload.useremail);

    request.onsuccess = (event) => {
      const existingData = event.target.result;
      if (!existingData) {
        const newData = {
          useremail: payload.useremail,
          lists: payload.lists
        };
        objectStore.add(newData);
        resolve(`New data added for ${payload.useremail}`);
      } else {
        payload.lists.forEach(newItem => {
          const existingItemIndex = existingData.lists.findIndex(item => item.id === newItem.id);
          if (existingItemIndex === -1) {
            existingData.lists.push(newItem);
          } else {
            existingData.lists[existingItemIndex] = { ...existingData.lists[existingItemIndex], ...newItem };
          }
        });

        objectStore.put(existingData);
        resolve(`Data updated for ${payload.useremail}`);
      }
    };

    request.onerror = (event) => {
      reject(`Error fetching data: ${event.target.errorCode}`);
    };
  });
}

export function addToMovieList(db, storeName, useremail, listId, newMovie) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.get(useremail);

    request.onsuccess = (event) => {
      const existingData = event.target.result;
      if (!existingData) {
        reject(`No entry found for useremail: ${useremail}`);
      } else {
        const listIndex = existingData.lists.findIndex(listItem => listItem.id === Number(listId));
        if (listIndex === -1) {
          reject(`No list found with id: ${listId}`);
        } else {
          // existingData.lists[listIndex].movie_list = existingData.list[listIndex].movie_list || [];
          existingData.lists[listIndex].movie_list.push(newMovie);

          objectStore.put(existingData);
          resolve(`New movie added to list with id: ${listId} for useremail: ${useremail}`);
        }
      }
    };

    request.onerror = (event) => {
      reject(`Error fetching data: ${event.target.errorCode}`);
    };
  });
}


export function removeFromMovieList(db, storeName, userEmail, listId, movieTitle) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.get(userEmail);

    request.onsuccess = (event) => {
      const existingData = event.target.result;
      if (!existingData) {
        reject(`No entry found for userEmail: ${userEmail}`);
      } else {
        const listIndex = existingData.lists.findIndex(listItem => listItem.id === Number(listId));
        if (listIndex === -1) {
          reject(`No list found with id: ${listId}`);
        } else {
          const movieIndex = existingData.lists[listIndex].movie_list.findIndex(movie => movie.Title === movieTitle);
          if (movieIndex === -1) {
            reject(`Movie titled "${movieTitle}" not found in the list.`);
          } else {
            existingData.lists[listIndex].movie_list.splice(movieIndex, 1);
            objectStore.put(existingData);
            resolve(`Movie titled "${movieTitle}" successfully removed from the list.`);
          }
        }
      }
    };

    request.onerror = (event) => {
      reject(`Error fetching data: ${event.target.errorCode}`);
    };
  });
}

export function clearStoreData(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.clear();

    request.onsuccess = () => {
      resolve(`All data cleared successfully from ${storeName}`);
    };

    request.onerror = (event) => {
      reject(`Error clearing data: ${event.target.errorCode}`);
    };
  });
}