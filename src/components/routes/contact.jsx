import { Form, useFetcher } from 'react-router-dom';
import { useLoaderData } from 'react-router';
import { getContact, updateContact } from '../contacts/contacts';

export const loader = async ({ params }) => {
    const contact = await getContact(params.contactId);
    if (!contact) {
        throw new Response('', { status: 404, statusText: 'Not Found' });
    }
    return { contact };
};

export const action = async ({ request, params }) => {
    // Извлечение данных формы из запроса и отправление их в модель данных
    let formData = await request.formData();
    return updateContact(params.contactId, {
        favorite: formData.get('favorite') === 'true',
    });
};

export default function Contact() {
    const { contact } = useLoaderData();

    return (
        <div id="contact">
            <div>
                <img key={contact.avatar} src={contact.avatar || null} />
            </div>
            <div className="right_side">
                <div>
                    <h1>
                        {contact.first || contact.last ? (
                            <>
                                {contact.first} {contact.last}
                            </>
                        ) : (
                            <i>No Name</i>
                        )}
                        <Favorite contact={contact} />
                    </h1>
                    {contact.notes && <p>{contact.notes}</p>}
                </div>
                <div className="btn_action">
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>
                    <Form
                        action="destroy"
                        method="post"
                        onSubmit={(event) => {
                            if (!confirm('Please confirm you want to delete this record')) {
                                event.preventDefault();
                            }
                        }}>
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

function Favorite({ contact }) {
    // Используется для вызова загрузчика вне истории
    const fetcher = useFetcher();

    let favorite = contact.favorite;
    if (fetcher.formData) {
        favorite = fetcher.formData.get('favorite') === 'true';
    }
    return (
        <fetcher.Form merhod="post">
            <button
                name="favorite"
                value={favorite ? 'false' : 'true'}
                aria-label={favorite ? 'Remove from' + ' favorites' : 'Add to favorites'}>
                {favorite ? '★' : '☆'}
            </button>
        </fetcher.Form>
    );
}
