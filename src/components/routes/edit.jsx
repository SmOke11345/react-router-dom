import { redirect, useLoaderData, useNavigate } from 'react-router';
import { Form } from 'react-router-dom';
import { updateContact } from '../contacts/contacts';

export const action = async ({ request, params }) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);

    await updateContact(params.contactId, updates);

    return redirect(`/contacts/${params.contactId}`);
};

export default function EditContact() {
    const { contact } = useLoaderData();

    // В нем хранится история перемещения по странице, в данном случае используется для перехода на предыдущую страницу
    const navigate = useNavigate();

    return (
        <Form method="post" id="contact-form">
            <p>
                <span>Name</span>
                <input
                    placeholder="First"
                    aria-label="First name"
                    type="text"
                    name="first"
                    defaultValue={contact.first}
                />
                <input
                    placeholder="Last"
                    aria-label="Last name"
                    type="text"
                    name="last"
                    defaultValue={contact.last}
                />
            </p>
            <label>
                <span>Avatar URL</span>
                <input
                    placeholder="https://example.com/avatar.jpg"
                    aria-label="Avatar URL"
                    type="text"
                    name="avatar"
                    defaultValue={contact.avatar}
                />
            </label>
            <label>
                <span>Notes</span>
                <textarea name="notes" defaultValue={contact.notes} rows={6} />
            </label>
            <p>
                <button type="submit">Save</button>
                {/*После нажатия на кнопку пользователь переместиться на страницу назад*/}
                {/*button type="button" предотвращает отправку формы */}
                <button type="button" onClick={() => navigate(-1)}>
                    Cancel
                </button>
            </p>
        </Form>
    );
}
