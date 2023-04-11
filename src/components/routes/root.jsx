import { useEffect } from 'react';
import { createContact, getContacts } from '../contacts/contacts';
import { Outlet, redirect, useLoaderData, useNavigation } from 'react-router';
import { Form, NavLink, useSubmit } from 'react-router-dom';

// URL-адрес по которому будет отправлена форма (Действие по умолчанию)
export const action = async () => {
    // После нажатия на кнопку создается новый контакт
    const contacts = await createContact();
    return redirect(`/contacts/${contacts.id}/edit`);
};

export const loader = async ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    const contacts = await getContacts(q);

    return { contacts, q };
};

export default function Root() {
    // Для получения данных из последнего отправленного запроса
    // Так же при получении новых данных из Form, hook синхронизируется
    const { contacts, q } = useLoaderData();
    // Используется для создания загрузки после перехода на другую страницу. Имеет три состояния Idle, submiting,
    // и loading
    const navigation = useNavigation();
    // Используется для того чтобы пользователю не нужно было нажимать на кнопку отправки формы, т.е форма
    // отправляется автоматически в процессе введения запроса
    const submit = useSubmit();

    // Создание спинера загрузки (navigation.location будет отображаться когда приложения переходит к новому URL
    // адресу и загружает для него данные. Затем он исчезает, когда больше нет ожидающих навигаций)
    const seaching =
        navigation.location && new URLSearchParams(navigation.location.search).has('q');

    useEffect(() => {
        document.getElementById('q').value = q;
    }, [q]);

    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            className={seaching ? 'loading' : ''}
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            defaultValue={q}
                            onChange={(event) => {
                                // Каждое нажатие клавиши больше не создает новые записи, поэтому пользователь
                                // может вернуться из результатов поиска, не нажимая на его много раз :)
                                const ifFirstScreen = q == null;
                                submit(event.currentTarget.form, {
                                    replace: !ifFirstScreen,
                                });
                            }}
                        />
                        <div id="search-spinner" aria-hidden hidden={!seaching} />
                        <div className="sr-only" aria-live="polite"></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {contacts.map((contact) => (
                                <li key={contact.id}>
                                    {/*Данный элемент знает "активный он или нет", используется для навигации, чтобы
                                     показать пользователю в какой вкладке он находиться в данный момент */}
                                    <NavLink
                                        to={`contacts/${contact.id}`}
                                        className={({ isActive, isPending }) =>
                                            isActive ? 'active' : isPending ? 'pending' : ''
                                        }>
                                        {contact.first || contact.last ? (
                                            <>
                                                {contact.first} {contact.last}
                                            </>
                                        ) : (
                                            <i>No Name</i>
                                        )}
                                        {''}
                                        {contact.favorite && <span>★</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            <div id="detail" className={navigation.state === 'loading' ? 'loading' : ''}>
                {/*// Для отображения дочерних маршрутов*/}
                <Outlet />
            </div>
        </>
    );
}
