'use client';

import { useContext } from 'react';
import { AgendaContext, AgendaContextValue } from './AgendaContext';

export const useAgenda = (): AgendaContextValue => {
  const context = useContext(AgendaContext);
  if (!context) {
    throw new Error('useAgenda deve ser utilizado dentro de um <AgendaProvider>');
  }
  return context;
};
