"use server"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addTicket(formData) {
  const ticket = Object.fromEntries(formData)

  const supabase = createServerActionClient({ cookies })

  // Insert the data
  const { data: { session } } = await supabase.auth.getSession()

  const { error } = await supabase.from('Tickets')
    .insert({
      ...ticket,
      user_email: session.user.email
    })

  if (error) {
    throw new Error('could not add the new ticket')
  }

  revalidatePath('/tickets')
  redirect('/tickets')
}

export async function deleteTicket(id) {
  const supabase = createServerActionClient({ cookies })

  // Delete the data
  const { error } = await supabase.from('Tickets')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error('could not delete the ticket')
  }

  revalidatePath('/tickets')
  redirect('/tickets')
}
