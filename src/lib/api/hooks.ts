import { useQuery } from "@tanstack/react-query";
import { isServiceEnabled, type ServiceName } from "./config";
import {
  centersService,
  checkinService,
  documentsService,
  donorsService,
  inventoryService,
  reservationsService,
  schedulingService,
} from "./services";
import {
  appointments,
  centers,
  checkinQueue,
  documents,
  donors,
  reservations,
  stockLevels,
} from "../mock-data";

/**
 * Hook genérico: chama o microserviço quando ele está configurado,
 * caso contrário devolve os dados de exemplo (modo demonstração).
 */
function useService<T>(
  service: ServiceName,
  key: string,
  fetcher: () => Promise<T>,
  fallback: T,
) {
  const enabled = isServiceEnabled(service);
  const query = useQuery({
    queryKey: [service, key],
    queryFn: fetcher,
    enabled,
    retry: 1,
  });

  return {
    data: (enabled ? (query.data ?? fallback) : fallback) as T,
    isLoading: enabled && query.isLoading,
    error: enabled ? query.error : null,
    /** true quando os dados vêm do mock (serviço fora do ar ou não configurado) */
    isDemo: !enabled || (!!query.error && !query.data),
  };
}

export const useStockLevels = () =>
  useService("estoque", "levels", inventoryService.levels, stockLevels);

export const useDonors = () =>
  useService("doadores", "list", donorsService.list, donors);

export const useAppointments = () =>
  useService("agendamento", "list", schedulingService.list, appointments);

export const useCheckinQueue = () =>
  useService("checkin", "queue", checkinService.queue, checkinQueue);

export const useCenters = () =>
  useService("centros", "list", centersService.list, centers);

export const useDocuments = () =>
  useService("documentos", "list", documentsService.list, documents);

export const useReservations = () =>
  useService("reservas", "list", reservationsService.list, reservations);
