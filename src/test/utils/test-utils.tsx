

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import * as testingLibrary from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ServiceProvider } from '@/providers/ServiceProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ServiceProvider>
          {children}
        </ServiceProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
// Override render with our custom one and export screen and fireEvent
export { customRender as render };
export const screen = testingLibrary.screen;
export const fireEvent = testingLibrary.fireEvent;

