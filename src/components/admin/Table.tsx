"use client";
import React, { useState, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import styles from './styles/Table.module.css';
import { ChevronRight } from 'lucide-react';

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
    filters = []
}, ref) => {    

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    
    // Calculate pagination
    const defaultRows = rowItems;
    const totalPages = Math.ceil(rowItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const [currentPageItems, setCurrentPageItems] = useState(defaultRows.slice(startIndex, endIndex));
    const currentPageSelectedCount = Array.from(selectedRows)
        .filter(index => index >= startIndex && index < endIndex)
        .length;

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
    
        // Step 4: Paginate
        setCurrentPageItems(filteredRows.slice(startIndex, endIndex));
    }, [searchText, rowItems, searchKey, currentPage, itemsPerPage, startIndex, endIndex, stableFilters]);
    
    

    // Expose these methods to parent
    useImperativeHandle(ref, () => ({
        getSelectedRowsData: () => {
            return Array.from(selectedRows).map(index => rowItems[index]);
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

        const maxInThisPage = startIndex + currentPageItems.length;
        
        if (isAllSelected) {
            for (let i = startIndex; i < maxInThisPage; i++) {
                newSelected.delete(i);
            }
            setIsAllSelected(false);

        } else {
            for (let i = startIndex; i < maxInThisPage; i++) {
                newSelected.add(i);
            }
            setIsAllSelected(true);

        }
        
        setSelectedRows(newSelected);
        notifySelectionChange(newSelected);
    };
    
    const handleRowSelect = (rowIndex: number) => {
        const absoluteIndex = startIndex + rowIndex;
        const newSelected = new Set(selectedRows);

        
        if (newSelected.has(absoluteIndex)) {
            newSelected.delete(absoluteIndex);
        } else {
            newSelected.add(absoluteIndex);
        }

        setSelectedRows(newSelected);
        notifySelectionChange(newSelected);
    };
    
    const isRowSelected = (rowIndex: number) => {
        return selectedRows.has(startIndex + rowIndex);
    };
    
    // Notify parent component of selection changes
    const notifySelectionChange = (selectedIndices: Set<number>) => {
        if (onSelectionChange) {
            const selectedData = Array.from(selectedIndices).map(index => rowItems[index]);
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

    if (rowItems.length === 0) {
        return (
            <div className={styles.emptyTable}>
                <span>Nenhum item encontrado</span>
                {/*
                
                <span style={{cursor: 'pointer', color: 'var(--color-primary)'}} 
                    onClick={() => window.location.reload()}>
                    Tente recarregar a página
                </span>
                */}
            </div>
        )
    }

    return (
        <div className={`${styles.container} ${className || ''}`}>
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
                                    ${styles.tableRow} ${isRowSelected(rowIndex) ? styles.selectedRow : ''} 
                                    ${rowItem.visualizada === true ? styles.seenRow : ''}
                                    ${rowItem.active === false ? styles.inactiveRow : ''}
                                    `}
                            >
                                {hasSelector && (
                                    <td className={styles.selectorCell}>
                                        <input
                                            type="checkbox"
                                            checked={isRowSelected(rowIndex)}
                                            onChange={() => handleRowSelect(rowIndex)}
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
  