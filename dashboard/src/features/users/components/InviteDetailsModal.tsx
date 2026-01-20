import React, { useState, useEffect } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import Badge from "@/shared/components/ui/Badge";
import { Toast } from "@/shared/components/ui/Toast";
import type { UserInvite } from "@/shared/types";
import { Building2, Mail, Calendar, Clock } from "lucide-react";
import { userInvitesService } from "../api/userInvites.service";
import { companiesService } from "@/features/companies/api/companies.service";

interface InviteDetailsModalProps {
  invite: UserInvite | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteSuccess: () => void;
}

export const InviteDetailsModal: React.FC<InviteDetailsModalProps> = ({
  invite,
  open,
  onOpenChange,
  onDeleteSuccess,
}) => {
  const [companyName, setCompanyName] = useState<string>("");
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({
    open: false,
    type: "success",
    message: "",
  });

  // Fetch company name when modal opens
  useEffect(() => {
    if (invite && open) {
      fetchCompanyName();
    }
  }, [invite, open]);

  const fetchCompanyName = async () => {
    if (!invite) return;

    try {
      setLoadingCompany(true);
      const response = await companiesService.getById(invite.company_id);
      setCompanyName(response.data.name);
    } catch (err) {
      console.error("Error fetching company:", err);
      setCompanyName(`Empresa #${invite.company_id}`);
    } finally {
      setLoadingCompany(false);
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleConfirmDelete = async () => {
    if (!invite) return;

    try {
      setDeleting(true);
      setError(null);
      await userInvitesService.delete(invite.id);

      // Show success toast
      setToast({
        open: true,
        type: "success",
        message: "Convite excluído com sucesso",
      });

      // Wait a bit for the toast to show, then close modal and refresh
      setTimeout(() => {
        onOpenChange(false);
        setShowConfirmation(false);
        onDeleteSuccess();
      }, 1500);
    } catch (err: any) {
      console.error("Error deleting invite:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Erro ao excluir convite";

      setError(errorMessage);
      setToast({
        open: true,
        type: "error",
        message: errorMessage,
      });
      setShowConfirmation(false);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!invite) return null;

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title="Detalhes do Convite"
        description="Informações do convite de usuário"
      >
        <div className="space-y-6">
          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Invite Details */}
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-subtitle mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-subtitle font-medium mb-1">Email</p>
                <p className="text-sm text-title">
                  {invite.email || "Qualquer email pode usar"}
                </p>
              </div>
            </div>

            {/* Company */}
            <div className="flex items-start gap-3">
              <Building2 size={20} className="text-subtitle mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-subtitle font-medium mb-1">
                  Empresa
                </p>
                <p className="text-sm text-title">
                  {loadingCompany ? "Carregando..." : companyName}
                </p>
              </div>
            </div>

            {/* Role & Status */}
            <div className="flex items-start gap-3">
              <div className="flex-1 flex gap-4">
                <div>
                  <p className="text-xs text-subtitle font-medium mb-2">
                    Função
                  </p>
                  <Badge variant={invite.role} />
                </div>
                <div>
                  <p className="text-xs text-subtitle font-medium mb-2">
                    Status
                  </p>
                  <Badge variant={invite.status} />
                </div>
              </div>
            </div>

            {/* Created At */}
            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-subtitle mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-subtitle font-medium mb-1">
                  Criado em
                </p>
                <p className="text-sm text-title">
                  {formatDate(invite.created_at)}
                </p>
              </div>
            </div>

            {/* Expires At */}
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-subtitle mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-subtitle font-medium mb-1">
                  Expira em
                </p>
                <p className="text-sm text-title">
                  {formatDate(invite.expires_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Delete Confirmation */}
          {showConfirmation ? (
            <div className="space-y-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-medium">
                Tem certeza que deseja excluir este convite?
              </p>
              <p className="text-xs text-red-700">
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancelDelete}
                  disabled={deleting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deleting ? "Excluindo..." : "Confirmar Exclusão"}
                </button>
              </div>
            </div>
          ) : (
            /* Delete Button */
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                onClick={handleDeleteClick}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Excluir Convite
              </button>
            </div>
          )}
        </div>
      </Modal>

      {/* Toast Notification */}
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onOpenChange={(open) => setToast({ ...toast, open })}
      />
    </>
  );
};
