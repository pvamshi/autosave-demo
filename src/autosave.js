import { useEffect, useState } from "react";
import { debounce } from "lodash";

// Debounce related code
const debouncedUpdatedDraftEntity = debounce(updateDraftEntity, 1000);

async function updateDraftEntity(entity, { URL, entityName }) {
  const response = await fetch(`${URL}/${entityName}_draft/${entity.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(entity)
  });

  if (response.status === 404) { // if entity draft doesnt exist already, create one instead of updating
    return await addDraftEntity(entity, { URL, entityName });
  }
  return await response.json();
}

async function addDraftEntity(entity, { URL, entityName }) {
  const response = await fetch(`${URL}/${entityName}_draft`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(entity)
  });
  return await response.json();
}

// Custom hook code for autosave

function useAutosave(originalEntity, { URL, entityName }) {
  const [entity, setEntity] = useState(originalEntity);

  useEffect(
    function() {
      async function initializeEntity() {
        // if draft already exists , load it . Else load the actual entity
        const entityDraft = await getEntityDraft(originalEntity.id);
        if (entityDraft) {
          setEntity(entityDraft);
        } else {
          setEntity(originalEntity);
        }
      }
      initializeEntity();
      return function savePendingChanges() {
        debouncedUpdatedDraftEntity.flush();
      };
    },
    [originalEntity]
  );

  // Handle update to any field
  function updateField(name, value) {
    const updatedEntity = Object.assign({}, entity, { [name]: value }); //create new object with the changes
    setEntity(updatedEntity); // update local entity
    debouncedUpdatedDraftEntity(updatedEntity, { URL, entityName }); // push to debounce to update
  }

  // Network calls

  async function getEntityDraft(entityId) {
    const response = await fetch(`${URL}/${entityName}_draft/${entityId}`);
    if (response.status !== 200) {
      return null;
    }
    return await response.json();
  }

  async function saveEntity(entity) {
    const response = await fetch(`${URL}/${entityName}/${entity.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entity)
    });
    await response.json();
    return await deleteDraftEntity(entity.id);
  }

  async function deleteDraftEntity(entityId) {
    const response = await fetch(`${URL}/${entityName}_draft/${entityId}`, {
      method: "DELETE"
    });
    return await response.json();
  }
  return [entity, updateField, saveEntity];
}

export default useAutosave;
