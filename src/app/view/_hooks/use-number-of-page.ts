'use client';

import { type Store, type StoreHandler } from '@react-pdf-viewer/core';
import { useEffect, useState } from 'react';

import { type StoreProps } from '../_types/store-props';

export const useNumberOfPages = (store: Store<StoreProps>): { numberOfPages: number } => {
    const [numberOfPages, setNumberOfPages] = useState(store.get('numberOfPages') ?? 0);

    const handleNumberOfPages: StoreHandler<number> = (total: number) => {
        setNumberOfPages(total);
    };

    useEffect(() => {
        store.subscribe('numberOfPages', handleNumberOfPages);

        return () => {
            store.unsubscribe('numberOfPages', handleNumberOfPages);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { numberOfPages };
};