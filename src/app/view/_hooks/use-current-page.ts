import { type Store, type StoreHandler,useIsomorphicLayoutEffect } from '@react-pdf-viewer/core';
import { useState } from 'react';

import { type StoreProps } from '../_types/store-props';

export const useCurrentPage = (store: Store<StoreProps>): { currentPage: number } => {
    const [currentPage, setCurrentPage] = useState<number>(store.get('currentPage') ?? 0);

    const handleCurrentPageChanged: StoreHandler<number> = (currentPageIndex: number) => {
        setCurrentPage(currentPageIndex);
    };

    useIsomorphicLayoutEffect(() => {
        store.subscribe('currentPage', handleCurrentPageChanged);

        return () => {
            store.unsubscribe('currentPage', handleCurrentPageChanged);
        };
    }, []);

    return { currentPage };
};