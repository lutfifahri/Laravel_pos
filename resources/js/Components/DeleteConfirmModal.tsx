import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    processing?: boolean;
}

export const DeleteConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Apakah anda yakin?',
    description = 'Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen dari server.',
    processing = false,
}: DeleteConfirmModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] border-none shadow-2xl">
                <DialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <DialogTitle className="text-center text-xl font-black">{title}</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="grid grid-cols-2 gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={processing}
                        className="rounded-xl font-bold"
                    >
                        Batal
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={processing}
                        className="rounded-xl font-bold shadow-lg shadow-red-500/20"
                    >
                        {processing ? 'Menghapus...' : 'Ya, Hapus'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
