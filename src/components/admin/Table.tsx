"use client"
import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
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
    onSelectionChange
}, ref) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    
    // Calculate pagination
    const totalPages = Math.ceil(rowItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageItems = rowItems.slice(startIndex, endIndex);
    
    const currentPageSelectedCount = Array.from(selectedRows)
        .filter(index => index >= startIndex && index < endIndex)
        .length;

    // Selection state
    const [isAllSelected, setIsAllSelected] = useState(currentPageItems.length > 0 && currentPageSelectedCount === currentPageItems.length);
    const [isIndeterminate, setIsIndeterminate] = useState(currentPageSelectedCount > 0 && currentPageSelectedCount < currentPageItems.length);
    
    // Expose methods to parent component
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
        
        if (isAllSelected) {
            for (let i = startIndex; i < endIndex; i++) {
                newSelected.delete(i);
            }
            setIsAllSelected(false);
            setIsIndeterminate(false);
        } else {
            for (let i = startIndex; i < endIndex; i++) {
                newSelected.add(i);
            }
            setIsAllSelected(true);
            setIsIndeterminate(false);
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
                                className={`${styles.tableRow} ${isRowSelected(rowIndex) ? styles.selectedRow : ''}`}
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
                                Previous
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
  