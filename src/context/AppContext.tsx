import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Trecho,
  Coleta,
  CronogramaItem,
  Alerta,
  Usuario,
} from '../types';
import {
  TRECHOS_MOCK,
  COLETAS_MOCK,
  CRONOGRAMA_MOCK,
  ALERTAS_MOCK,
  USUARIOS_MOCK,
} from '../data/mockData';

interface AppContextData {
  usuario: Usuario | null;
  trechos: Trecho[];
  coletas: Coleta[];
  cronograma: CronogramaItem[];
  alertas: Alerta[];
  login: (email: string, perfil: string) => boolean;
  logout: () => void;
  adicionarAoCronograma: (trechoId: string, equipe: string, data: string, dia: string) => void;
  marcarAlertaLido: (alertaId: string) => void;
  marcarTrechoProgramado: (trechoId: string) => void;
  getTrechoById: (id: string) => Trecho | undefined;
  alertasNaoLidos: number;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [trechos, setTrechos] = useState<Trecho[]>(TRECHOS_MOCK);
  const [coletas] = useState<Coleta[]>(COLETAS_MOCK);
  const [cronograma, setCronograma] = useState<CronogramaItem[]>(CRONOGRAMA_MOCK);
  const [alertas, setAlertas] = useState<Alerta[]>(ALERTAS_MOCK);

  const login = useCallback((email: string, perfil: string): boolean => {
    const found = USUARIOS_MOCK.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.perfil === perfil
    );
    if (found) {
      setUsuario(found);
      return true;
    }
    // Allow demo login with any email and matching profile
    const perfilMap: Record<string, Usuario> = {
      operador: USUARIOS_MOCK[1],
      supervisor: USUARIOS_MOCK[0],
      gestor: USUARIOS_MOCK[2],
    };
    const demoUser = perfilMap[perfil];
    if (demoUser) {
      setUsuario({ ...demoUser, email });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUsuario(null);
  }, []);

  const adicionarAoCronograma = useCallback(
    (trechoId: string, equipe: string, data: string, dia: string) => {
      const exists = cronograma.find((c) => c.trechoId === trechoId);
      if (exists) return;

      const newItem: CronogramaItem = {
        id: `cron-${Date.now()}`,
        trechoId,
        equipe,
        diaSemana: dia,
        dataPlaneada: data,
        status: 'planejado',
        prioridade: cronograma.length + 1,
      };
      setCronograma((prev) => [...prev, newItem]);
    },
    [cronograma]
  );

  const marcarAlertaLido = useCallback((alertaId: string) => {
    setAlertas((prev) =>
      prev.map((a) => (a.id === alertaId ? { ...a, lido: true } : a))
    );
  }, []);

  const marcarTrechoProgramado = useCallback((trechoId: string) => {
    setTrechos((prev) =>
      prev.map((t) =>
        t.id === trechoId ? { ...t, programadoParaCorte: true } : t
      )
    );
  }, []);

  const getTrechoById = useCallback(
    (id: string) => trechos.find((t) => t.id === id),
    [trechos]
  );

  const alertasNaoLidos = alertas.filter((a) => !a.lido).length;

  return (
    <AppContext.Provider
      value={{
        usuario,
        trechos,
        coletas,
        cronograma,
        alertas,
        login,
        logout,
        adicionarAoCronograma,
        marcarAlertaLido,
        marcarTrechoProgramado,
        getTrechoById,
        alertasNaoLidos,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
