import { deleteContact } from '../contacts/contacts';
import { redirect } from 'react-router';

export const action = async ({ params }) => {
    await deleteContact(params.contactId);
    throw new Error();
    return redirect('/');
};
