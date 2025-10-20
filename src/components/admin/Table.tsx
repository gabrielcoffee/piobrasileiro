"use client";
import React, { useState, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import styles from './styles/Table.module.css';
import { ChevronRight, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';

// Define types for the table data
interface TableHeaderItem {
    key: string;
    label: string;
    className?: string;
}

interface TableRowItem {
    [key: string]: React.ReactNode; // Can be any React content
}

interface TableProps {
    headerItems: TableHeaderItem[];
    rowItems: TableRowItem[];
    itemsPerPage?: number;
    hasSelector?: boolean;
    className?: string;
    onSelectionChange?: (selectedRows: TableRowItem[]) => void;
    searchText?: string;
    searchKey?: string;
    filters?: { key: string, value: string | boolean | number }[];
    rowIdKey?: string;
}

export interface TableRef {
    getSelectedRowsData: () => TableRowItem[];
    getSelectedRowsCount: () => number;
    clearSelection: () => void;
}

const Table = forwardRef<TableRef, TableProps>(({ 
    headerItems, 
    rowItems, 
    itemsPerPage = 8, 
    hasSelector = false,
    className,
    onSelectionChange,
    searchText = '',
    searchKey = 'nome_completo',
    filters = [],
    rowIdKey = 'id'
}, ref) => {    

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
    const [showAllMobile, setShowAllMobile] = useState(false);
    const [allFilteredItems, setAllFilteredItems] = useState<TableRowItem[]>(rowItems);
    
    // Calculate pagination
    const defaultRows = rowItems;
    const totalPages = Math.ceil(rowItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const [currentPageItems, setCurrentPageItems] = useState(defaultRows.slice(startIndex, endIndex));
    const currentPageSelectedCount = currentPageItems.filter(item => 
        selectedRows.has(String(item[rowIdKey]))
    ).length;

    // For filtering:
    const stableFilters = useMemo(() => {
        return filters.filter(f => {
          // Remove if value is string '' OR boolean false OR number 0
          if (typeof f.value === "string" && f.value.trim() === "") return false;
          return true; // keep everything else
        });
      }, [JSON.stringify(filters)]);
      

    // Selection state
    const [isAllSelected, setIsAllSelected] = useState(currentPageItems.length > 0 && currentPageSelectedCount === currentPageItems.length);
    const [isIndeterminate, setIsIndeterminate] = useState(currentPageSelectedCount > 0 && currentPageSelectedCount < currentPageItems.length);

    useEffect(() => {
        // Initialize current page items
        setCurrentPageItems(defaultRows.slice(startIndex, endIndex));
    }, [rowItems]);
    
    // New filter pipeline
    useEffect(() => {
        let filteredRows = [...rowItems]; // start with prop rows
    
        // Step 1: Apply filters
        if (stableFilters && stableFilters.length > 0) {
            stableFilters.forEach(({ key, value }) => {
                filteredRows = filteredRows.filter(row => {
                    const rowValue = row[key];
    
                    // Only allow primitive types for filtering
                    if (
                        typeof rowValue !== "string" &&
                        typeof rowValue !== "number" &&
                        typeof rowValue !== "boolean"
                    ) {
                        return true; // ignore this filter
                    }
    
                    // Normalize string comparison
                    if (typeof rowValue === "string" && typeof value === "string") {
                        const normalizedRowValue = rowValue
                            .toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "");
    
                        const normalizedFilterValue = value
                            .toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "");
    
                        return normalizedRowValue === normalizedFilterValue;
                    }
                    // For number/boolean
                    return rowValue === value;
                });
            });
        }
    
        // Step 2: Apply text search
        if (searchText) {
            const normalizedSearch = searchText
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
    
            filteredRows = filteredRows.filter(row => {
                const value = row[searchKey]?.toString().toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "") || "";
    
                return value.includes(normalizedSearch);
            });
        }
    
        // Step 3: Sort alphabetically by searchKey
        filteredRows.sort((a, b) => {
            const aValue = (a[searchKey]?.toString() || "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
            const bValue = (b[searchKey]?.toString() || "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
    
            return aValue.localeCompare(bValue);
        });
    
        // Step 4: Store all filtered items and paginate
        setAllFilteredItems(filteredRows);
        setCurrentPageItems(filteredRows.slice(startIndex, endIndex));
    }, [searchText, rowItems, searchKey, currentPage, itemsPerPage, startIndex, endIndex, stableFilters]);
    
    

    // Expose these methods to parent
    useImperativeHandle(ref, () => ({
        getSelectedRowsData: () => {
            return rowItems.filter(row => selectedRows.has(String(row[rowIdKey])));
        },
        getSelectedRowsCount: () => {
            return selectedRows.size;
        },
        clearSelection: () => {
            setSelectedRows(new Set());
            if (onSelectionChange) {
                onSelectionChange([]);
            }
        }
    }));
    
    const handleSelectAll = () => {
        const newSelected = new Set(selectedRows);
        
        if (isAllSelected) {
            currentPageItems.forEach(item => {
                newSelected.delete(String(item[rowIdKey]));
            });
            setIsAllSelected(false);
        } else {
            currentPageItems.forEach(item => {
                newSelected.add(String(item[rowIdKey]));
            });
            setIsAllSelected(true);
        }
        
        setSelectedRows(newSelected);
        notifySelectionChange(newSelected);
    };
    
    const handleRowSelect = (rowItem: TableRowItem) => {
        const rowId = String(rowItem[rowIdKey]);
        const newSelected = new Set(selectedRows);
        
        if (newSelected.has(rowId)) {
            newSelected.delete(rowId);
        } else {
            newSelected.add(rowId);
        }

        setSelectedRows(newSelected);
        notifySelectionChange(newSelected);
    };
    
    const isRowSelected = (rowItem: TableRowItem) => {
        return selectedRows.has(String(rowItem[rowIdKey]));
    };
    
    // Notify parent component of selection changes
    const notifySelectionChange = (selectedIds: Set<string | number>) => {
        if (onSelectionChange) {
            const selectedData = rowItems.filter(row => selectedIds.has(String(row[rowIdKey])));
            onSelectionChange(selectedData);
        }
    };
    
    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        
        if (totalPages <= 7) {
            // If 7 or fewer pages, show all
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            if (currentPage <= 4) {
                // Show pages 2, 3, 4, 5
                for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
                    pages.push(i);
                }
                if (totalPages > 5) {
                    pages.push('...');
                }
            } else if (currentPage >= totalPages - 3) {
                // Show pages near the end
                if (totalPages > 5) {
                    pages.push('...');
                }
                for (let i = Math.max(2, totalPages - 4); i < totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Show pages around current page
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
            }
            
            // Always show last page
            pages.push(totalPages);
        }
        
        return pages;
    };
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    
    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    useEffect(() => {
        if (rowItems.length > itemsPerPage) {
            setCurrentPage(1);
        }
        setShowAllMobile(false);
    }, [rowItems.length, searchText, itemsPerPage]);

    useEffect(() => {
        const newTotalPages = Math.ceil(rowItems.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        }
    }, [rowItems.length, currentPage, itemsPerPage]);

    useEffect(() => {
        if (selectedRows.size === 0) {
            setIsAllSelected(false);
        } else {
            setIsAllSelected(true);
        }
    }, [selectedRows]);

    const handleShowMore = () => {
        setShowAllMobile(true);
    };

    const handleScrollToTop = () => {
        setShowAllMobile(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Get mobile items to display
    const getMobileItems = () => {
        if (showAllMobile) {
            return allFilteredItems;
        }
        return currentPageItems;
    };

    const mobileItems = getMobileItems();
    const hasMoreItems = !showAllMobile && allFilteredItems.length > itemsPerPage;

    if (rowItems.length === 0) {
        return (
            <div className={styles.emptyTable}>
                <span 
                    style={{cursor: 'pointer', color: 'var(--color-text)', textAlign: 'center'}} 
                    onClick={() => window.location.reload()}
                >
                    Nenhum item encontrado.<br></br> Clique aqui para recarregar a página.
                </span>
            </div>
        )
    }

    return (
        <div className={`${styles.container} ${className || ''}`}>
            {/* Desktop Table View */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr className={styles.tableRow}>
                            {hasSelector && (
                                <th className={styles.selectorHeader}>
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        ref={(input) => {
                                            if (input) {
                                                input.indeterminate = isIndeterminate;
                                            }
                                        }}
                                        onChange={() => handleSelectAll()}
                                        className={styles.checkbox}
                                    />
                                </th>
                            )}
                            {headerItems.map((headerItem) => (
                                <th 
                                    key={headerItem.key} 
                                    className={`${styles.tableHead} ${headerItem.className || ''}`}
                                >
                                    {headerItem.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {currentPageItems.map((rowItem, rowIndex) => (
                            <tr 
                                key={startIndex + rowIndex} 
                                className={`
                                    ${styles.tableRow} ${isRowSelected(rowItem) ? styles.selectedRow : ''} 
                                    ${rowItem.visualizada === true ? styles.seenRow : ''}
                                    ${rowItem.active === false ? styles.inactiveRow : ''}
                                    `}
                            >
                                {hasSelector && (
                                    <td className={styles.selectorCell}>
                                        <input
                                            type="checkbox"
                                            checked={isRowSelected(rowItem)}
                                            onChange={() => handleRowSelect(rowItem)}
                                            className={styles.checkbox}
                                        />
                                    </td>
                                )}
                                {headerItems.map((headerItem) => (
                                    <td 
                                        key={headerItem.key} 
                                        className={`${styles.tableCell} ${headerItem.className || ''}`}
                                    >
                                        {rowItem[headerItem.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className={styles.mobileCardContainer}>
                {mobileItems.map((rowItem, rowIndex) => (
                    <div 
                        key={showAllMobile ? String(rowItem[rowIdKey]) : startIndex + rowIndex} 
                        className={`
                            ${styles.mobileCard} 
                            ${isRowSelected(rowItem) ? styles.selectedCard : ''} 
                            ${rowItem.visualizada === true ? styles.seenCard : ''}
                            ${rowItem.active === false ? styles.inactiveCard : ''}
                        `}
                    >
                        {/* Checkbox */}
                        {hasSelector && (
                            <div className={styles.mobileCardCheckbox}>
                                <input
                                    type="checkbox"
                                    checked={isRowSelected(rowItem)}
                                    onChange={() => handleRowSelect(rowItem)}
                                    className={styles.checkbox}
                                />
                            </div>
                        )}

                        {/* Card Content */}
                        <div className={`${styles.mobileCardContent} ${hasSelector ? styles.withCheckbox : ''}`}>
                            {/* Name - Primary Color with optional seen indicator */}
                            <div className={styles.mobileCardNameContainer}>
                                {rowItem.visualizada === false && (
                                    <div className={styles.seenIcon}></div>
                                )}
                                <div className={styles.mobileCardName}>
                                    {rowItem[searchKey] || rowItem.nome_completo || (rowItem.visualizada !== undefined ? '' : 'Nome não encontrado')}
                                </div>
                            </div>

                            {/* Fields */}
                            <div className={styles.mobileCardFields}>
                                {headerItems
                                    .filter(headerItem => headerItem.key !== searchKey && headerItem.key !== 'nome_completo' && headerItem.key !== 'acao' && headerItem.key !== 'status')
                                    .map((headerItem) => (
                                        <div key={headerItem.key} className={styles.mobileCardField}>
                                            <span className={styles.mobileCardFieldLabel}>{headerItem.label}:</span>
                                            <span className={styles.mobileCardFieldValue}>{rowItem[headerItem.key]}</span>
                                        </div>
                                    ))
                                }
                            </div>

                            {/* Bottom Row: Status (left) and Action Buttons (right) */}
                            <div className={styles.mobileCardActions}>
                                {rowItem.status && (
                                    <div className={styles.mobileCardStatus}>
                                        {rowItem.status}
                                    </div>
                                )}
                                {rowItem.acao && (
                                    <div className={styles.mobileCardActionButtons}>
                                        {rowItem.acao}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Mostrar mais button - Mobile only */}
                {hasMoreItems && (
                    <div className={styles.showMoreButtonContainer}>
                        <Button 
                            variant="text"
                            onClick={handleShowMore}
                        >
                            Mostrar mais
                        </Button>
                    </div>
                )}
            </div>

            {/* Scroll to top button - Mobile only, shown when all items are displayed */}
            {showAllMobile && (
                <button 
                    className={styles.scrollToTopButton}
                    onClick={handleScrollToTop}
                    aria-label="Voltar ao topo"
                >
                    <ChevronUp size={24} />
                </button>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <div className={styles.paginationContent}>

                        <div className={styles.paginationItem}>
                            <button 
                                className={styles.paginationPrevious}
                                onClick={handlePrevious}
                                disabled={currentPage === 1}
                            >
                                Anterior
                            </button>
                        </div>

                        <div className={styles.paginationNumbers}>                        
                        {getPageNumbers().map((page, index) => (
                            <div key={index} className={styles.paginationItem}>
                                {page === '...' ? (
                                    <span className={styles.paginationEllipsis}>...</span>
                                ) : (
                                    <button 
                                        className={`${styles.paginationLink} ${page === currentPage ? styles.active : ''}`}
                                        onClick={() => handlePageChange(page as number)}
                                    >
                                        {page}
                                    </button>
                                )}
                            </div>
                        ))}
                        </div>

                        
                        <div className={styles.paginationItem}>
                            <button 
                                className={styles.paginationNext}
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                            >
                                Próximo
                                <ChevronRight />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default Table;
  