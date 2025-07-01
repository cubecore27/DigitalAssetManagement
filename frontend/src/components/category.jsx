import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faEdit, faTrash,
  faChevronDown, faChevronRight, faSave, faTimes, faFolder, faFolderOpen
} from '@fortawesome/free-solid-svg-icons';
import styles from './category.module.css';

const API_BASE = 'https://digitalassetmanagement-production.up.railway.app/';

function CategoryItem({ category, depth, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editName, setEditName] = useState(category.name);
  const [editDescription, setEditDescription] = useState(category.description);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const toggleExpand = () => setExpanded(!expanded);

  const handleEditSave = async () => {
    if (!editName.trim()) return;
    
    setLoading(true);
    try {
      await axios.patch(`${API_BASE}categories/categories/${category.id}/`, {
        name: editName,
        description: editDescription
      });
      setEditing(false);
      onRefresh();
    } catch (error) {
      console.error('Error updating category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete "${category.name}" and all its subcategories?`)) {
      setLoading(true);
      try {
        await axios.delete(`${API_BASE}categories/categories/${category.id}/`);
        onRefresh();
      } catch (error) {
        console.error('Error deleting category:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddSub = async () => {
    if (!newName.trim()) return;
    
    setLoading(true);
    try {
      await axios.post(`${API_BASE}categories/categories/`, {
        name: newName,
        description: newDescription,
        parent_category: category.id
      });
      setNewName('');
      setNewDescription('');
      setAdding(false);
      setExpanded(true);
      onRefresh();
    } catch (error) {
      console.error('Error adding subcategory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    } else if (e.key === 'Escape') {
      if (editing) setEditing(false);
      if (adding) setAdding(false);
    }
  };

  const hasSubcategories = category.subcategories?.length > 0;
  const canHaveChildren = depth < 3;

  return (
    <div className={`${styles.categoryItem} ${loading ? styles.loading : ''}`} 
         style={{ '--depth': depth }}>
      
      <div className={styles.categoryRow}>
        <div className={styles.categoryInfo}>
          {hasSubcategories && canHaveChildren ? (
            <button 
              className={styles.expandButton}
              onClick={toggleExpand}
              aria-expanded={expanded}
              aria-label={expanded ? 'Collapse' : 'Expand'}
            >
              <FontAwesomeIcon icon={expanded ? faChevronDown : faChevronRight} />
            </button>
          ) : (
            <div className={styles.expandButton} />
          )}

          <div className={styles.categoryIcon}>
            <FontAwesomeIcon 
              icon={hasSubcategories && expanded ? faFolderOpen : faFolder} 
              className={styles.folderIcon}
            />
          </div>

          {editing ? (
            <div className={styles.editForm}>
              <input
                type="text"
                className={styles.editInput}
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={e => handleKeyPress(e, handleEditSave)}
                placeholder="Category name"
                autoFocus
              />
              <input
                type="text"
                className={styles.editInput}
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                onKeyDown={e => handleKeyPress(e, handleEditSave)}
                placeholder="Description"
              />
            </div>
          ) : (
            <div className={styles.categoryContent}>
              <h3 className={styles.categoryName}>{category.name}</h3>
              {category.description && (
                <p className={styles.categoryDescription}>{category.description}</p>
              )}
            </div>
          )}
        </div>

        <div className={styles.categoryActions}>
          {editing ? (
            <>
              <button 
                className={`${styles.actionButton} ${styles.saveButton}`}
                onClick={handleEditSave}
                disabled={!editName.trim() || loading}
                title="Save changes"
              >
                <FontAwesomeIcon icon={faSave} />
              </button>
              <button 
                className={`${styles.actionButton} ${styles.cancelButton}`}
                onClick={() => setEditing(false)}
                title="Cancel editing"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </>
          ) : (
            <>
              {canHaveChildren && (
                <button 
                  className={`${styles.actionButton} ${styles.addButton}`}
                  onClick={() => setAdding(!adding)}
                  title="Add subcategory"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              )}
              <button 
                className={`${styles.actionButton} ${styles.editButton}`}
                onClick={() => setEditing(true)}
                title="Edit category"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button 
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={handleDelete}
                disabled={loading}
                title="Delete category"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </>
          )}
        </div>
      </div>

      {adding && canHaveChildren && (
        <div className={styles.addSubcategoryForm}>
          <div className={styles.formRow}>
            <input
              type="text"
              className={styles.formInput}
              placeholder="Subcategory name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => handleKeyPress(e, handleAddSub)}
              autoFocus
            />
            <input
              type="text"
              className={styles.formInput}
              placeholder="Description (optional)"
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              onKeyDown={e => handleKeyPress(e, handleAddSub)}
            />
          </div>
          <div className={styles.formActions}>
            <button 
              className={`${styles.formButton} ${styles.createButton}`}
              onClick={handleAddSub}
              disabled={!newName.trim() || loading}
            >
              Create
            </button>
            <button 
              className={`${styles.formButton} ${styles.cancelFormButton}`}
              onClick={() => setAdding(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {expanded && category.subcategories?.map(child => (
        <CategoryItem
          key={child.id}
          category={child}
          depth={depth + 1}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingRoot, setAddingRoot] = useState(false);
  const [rootName, setRootName] = useState('');
  const [rootDescription, setRootDescription] = useState('');

  const fetchTree = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}categories/tree/`);
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchTree(); 
  }, []);

  const handleAddRoot = async () => {
    if (!rootName.trim()) return;
    
    try {
      await axios.post(`${API_BASE}categories/categories/`, {
        name: rootName,
        description: rootDescription,
        parent_category: null
      });
      setRootName('');
      setRootDescription('');
      setAddingRoot(false);
      fetchTree();
    } catch (error) {
      console.error('Error adding root category:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddRoot();
    } else if (e.key === 'Escape') {
      setAddingRoot(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button 
          className={`${styles.addRootButton} ${addingRoot ? styles.active : ''}`}
          onClick={() => setAddingRoot(!addingRoot)}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Root Category
        </button>
      </div>

      {addingRoot && (
        <div className={styles.rootCategoryForm}>
          <div className={styles.formRow}>
            <input
              type="text"
              className={styles.formInput}
              placeholder="Root category name"
              value={rootName}
              onChange={e => setRootName(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
            />
            <input
              type="text"
              className={styles.formInput}
              placeholder="Description (optional)"
              value={rootDescription}
              onChange={e => setRootDescription(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
          <div className={styles.formActions}>
            <button 
              className={`${styles.formButton} ${styles.createButton}`}
              onClick={handleAddRoot}
              disabled={!rootName.trim()}
            >
              Create Category
            </button>
            <button 
              className={`${styles.formButton} ${styles.cancelFormButton}`}
              onClick={() => setAddingRoot(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={styles.categoryList}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className={styles.emptyState}>
            <FontAwesomeIcon icon={faFolder} className={styles.emptyIcon} />
            <h3>No categories yet</h3>
            <p>Create your first category to get started</p>
          </div>
        ) : (
          categories.map(cat => (
            <CategoryItem
              key={cat.id}
              category={cat}
              depth={0}
              onRefresh={fetchTree}
            />
          ))
        )}
      </div>
    </div>
  );
}