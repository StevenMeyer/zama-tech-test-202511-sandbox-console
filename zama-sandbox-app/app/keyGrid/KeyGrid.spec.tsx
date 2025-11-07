import '@testing-library/jest-dom';
import { getAllByRole, getByRole, render, screen } from '@testing-library/react';
import { KeyGrid } from './KeyGrid';
import { ApiKey } from '../api-key/apiKey';
import { v4 } from '../utils/uuid';

describe('KeyGrid component', function () {
    beforeEach(function(): void {
        jest.useFakeTimers({
            now: new Date('2025-11-01T09:30:00.000Z'),
        });
    });

    afterAll(function (): void {
        jest.useRealTimers();
    });

    function mask(visible: string): string {
        return `********-****-****-****-******${visible}`;
    }

    /** Checks a row has named cells in a certain order */
    function hasCells(row: HTMLElement, ...cellNames: readonly string[]): void {
        const cells = getAllByRole(row, 'gridcell');
        cells.forEach((cell, index): void => {
            expect(cell).toHaveAccessibleName(cellNames[index]);
        });
    }
    
    it('renders an existing key', function () {
        render(<KeyGrid apiKeys={[
            new ApiKey({
                name: 'My first API key',
                id: v4(),
                maskedKey: '********-****-****-****-******fbe830',
                createdAt: '2025-09-26T16:30:00.000', // use local tz
                expiresAt: '2025-12-27T00:00:00.000',
                isRevoked: false,
            }),
        ]} />);
        const row = screen.getAllByRole('row').find((element): boolean => {
            return element.dataset.rowindex !== undefined;
        });
        expect(row).toBeVisible();
        hasCells(row!, 'My first API key', mask('fbe830'), 'Not revoked Revoke', 'Not expired', '2025-09-26 16:30', '2025-12-27 00:00');
    });

    it('renders a key has expired', function(): void {
        render(<KeyGrid apiKeys={[
            new ApiKey({
                name: 'My expired API key',
                id: v4(),
                maskedKey: '********-****-****-****-******483594',
                createdAt: '2025-05-14T13:25:00.000',
                expiresAt: '2025-08-15T00:00:00.000',
                isRevoked: false,
            }),
        ]} />);
        const row = screen.getAllByRole('row').find((element): boolean => {
            return element.dataset.rowindex !== undefined;
        });
        expect(row).toBeVisible();
        hasCells(row!, 'My expired API key', mask('483594'), 'Not revoked Revoke', 'Expired', '2025-05-14 13:25', '2025-08-15 00:00');
    });

    it('renders a key which never expires', function(): void {
        render(<KeyGrid apiKeys={[
            new ApiKey({
                name: 'My everlasting API key',
                id: v4(),
                maskedKey: '********-****-****-****-******ed7c4b',
                createdAt: '2025-07-09T12:50:00.000',
                isRevoked: false,
            }),
        ]} />);
        const row = screen.getAllByRole('row').find((element): boolean => {
            return element.dataset.rowindex !== undefined;
        });
        expect(row).toBeVisible();
        hasCells(row!, 'My everlasting API key', mask('ed7c4b'), 'Not revoked Revoke', 'Not expired', '2025-07-09 12:50', 'Never');
    });

    it('renders a revoked key', function (): void {
        render(<KeyGrid apiKeys={[
            new ApiKey({
                name: 'My revoked API key',
                id: v4(),
                maskedKey: '********-****-****-****-******00ee9f',
                createdAt: '2025-06-01T09:03:04.000',
                isRevoked: true,
            }),
        ]} />);
        const row = screen.getAllByRole('row').find((element): boolean => {
            return element.dataset.rowindex !== undefined;
        });
        expect(row).toBeVisible();
        hasCells(row!, 'My revoked API key', mask('00ee9f'), 'Revoked', 'Not expired', '2025-06-01 09:03', 'Never');
    });

    it('renders a new, pending key', function (): void {
        render(<KeyGrid apiKeys={[
            new ApiKey({
                name: 'My new API key',
            }),
        ]} />);
        const row = screen.getAllByRole('row').find((element): boolean => {
            return element.dataset.rowindex !== undefined;
        });
        expect(row).toBeVisible();
        hasCells(row!, 'My new API key', 'Pending', 'Not revoked Revoke', 'Not expired', '09:30', 'Never');
    });

    it('renders a key whose key value has not been viewed, yet', function (): void {
        render(<KeyGrid apiKeys={[
            new ApiKey({
                name: 'My new API key',
                id: v4(),
                maskedKey: '********-****-****-****-******1ce619',
                key: '7027dac2-cfa5-4c57-ba0c-f948211ce619',
                createdAt: '2025-11-01T09:29:56.834',
                isRevoked: false,
            }),
        ]} />);
        const row = screen.getAllByRole('row').find((element): boolean => {
            return element.dataset.rowindex !== undefined;
        });
        expect(row).toBeVisible();
        hasCells(row!, 'My new API key', 'View key', 'Not revoked Revoke', 'Not expired', '09:29', 'Never');
    });
});