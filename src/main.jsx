import React from 'react';
import ReactDOM from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Для переименования компонента использовать as
import Root, { action as rootAction, loader as rootLoader } from './components/routes/root';
import Contact, {
    action as contactAction,
    loader as contactLoader,
} from './components/routes/contact';
import EditContact, { action as editAction } from './components/routes/edit';
import { action as destroyAction } from './components/routes/destroy';

import ErrorPage from './components/routes/error-page';

import './index.css';
import { Index } from './components/routes';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage />,
        loader: rootLoader,
        action: rootAction,
        // Для получения дочерних маршрутов
        children: [
            // Создается как экран отображения стандартных дочерних маршрутов Outlet
            {
                errorElement: <ErrorPage />,
                children: [
                    {
                        index: true,
                        element: <Index />,
                    },
                    {
                        path: 'contacts/:contactId',
                        element: <Contact />,
                        loader: contactLoader,
                        action: contactAction,
                    },
                ],
            },
            {
                path: 'contacts/:contactId/edit',
                element: <EditContact />,
                loader: contactLoader,
                action: editAction,
            },
            {
                path: 'contacts/:contactId/destroy',
                action: destroyAction,
                errorElement: <div>God damn , not found it</div>,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
