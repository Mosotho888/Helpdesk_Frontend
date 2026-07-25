import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createTicket } from '../api/ticketApi'
import { createTicketSchema, type CreateTicketFormValues } from '../schemas/createTicketSchema'

export function CreateTicketForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
  })

  const mutation = useMutation({
    mutationFn: createTicket,
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      navigate(`/tickets/${ticket.id}`)
    },
  })

  function onSubmit(values: CreateTicketFormValues) {
    mutation.mutate(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '500px', padding: '2rem' }}>
      <h1>Create Ticket</h1>

      <div>
        <label htmlFor="subject">Subject</label>
        <input id="subject" {...register('subject')} />
        {errors.subject && <p role="alert" style={{ color: 'red' }}>{errors.subject.message}</p>}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" rows={5} {...register('description')} />
        {errors.description && <p role="alert" style={{ color: 'red' }}>{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="priority">Priority</label>
        <select id="priority" {...register('priority')}>
          <option value="">Select priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      <div>
        <label htmlFor="category">Category</label>
        <input id="category" {...register('category')} />
      </div>

      {mutation.isError && <p role="alert" style={{ color: 'red' }}>Failed to create ticket. Please try again.</p>}

      <button type="submit" disabled={isSubmitting || mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Ticket'}
      </button>
    </form>
  )
}