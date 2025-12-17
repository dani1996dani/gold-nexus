import { redirect } from 'next/navigation';

// This will be the default admin page, which for now just redirects
// to the lead management page.
export default function AdminPage() {
  redirect('/admin/leads');
}
