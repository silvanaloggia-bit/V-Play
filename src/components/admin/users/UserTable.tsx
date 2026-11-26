import { plans } from '../../../data/initialData'
import type { User } from '../../../types/user'
import { formatDate } from '../../../utils/formatDate'
import './UserTable.css'

interface UserTableProps {
  users: User[]
  onEdit: (userId: string) => void
  onDelete: (userId: string) => void
  canDelete: boolean
}

export default function UserTable({ users, onEdit, onDelete, canDelete }: UserTableProps) {
  return (
    <section>
      <div className="table-responsive user-table__table-wrapper">
        <table className="table table-hover align-middle mb-0 user-table__table">
          <thead>
            <tr>
              <th scope="col">Usuario</th>
              <th scope="col">Plan</th>
              <th scope="col">Estado</th>
              <th scope="col">Vence</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="user-table__empty">
                  Todavía no hay usuarios registrados.
                </td>
              </tr>
            )}

            {users.map((user) => {
              const userPlan = plans.find((plan) => plan.id === user.planId)
              const isUserActive = user.isActive !== false

              return (
                <tr key={user.id}>
                  <td>
                    <span className="user-table__user-name">
                      {user.name} {user.lastName}
                    </span>
                    <span className="user-table__user-email">{user.email}</span>
                  </td>
                  <td>
                    <span className="badge user-table__plan-badge">
                      {userPlan ? userPlan.name : 'Sin plan'}
                    </span>
                  </td>
                  <td>
                    {isUserActive ? (
                      <span className="badge user-table__badge-active">Activo</span>
                    ) : (
                      <span className="badge user-table__badge-inactive">Inactivo</span>
                    )}
                  </td>
                  <td>{user.planEndDate ? formatDate(user.planEndDate) : '—'}</td>
                  <td>
                    <div className="user-table__actions">
                      <button
                        type="button"
                        className="btn btn-sm user-table__icon-button"
                        aria-label={`Editar a ${user.email}`}
                        title="Editar"
                        onClick={() => onEdit(user.id)}
                      >
                        <i className="bi bi-pencil" aria-hidden="true"></i>
                      </button>
                      {canDelete && (
                        <button
                          type="button"
                          className="btn btn-sm user-table__icon-button user-table__delete-button"
                          aria-label={`Eliminar a ${user.email}`}
                          title="Eliminar"
                          onClick={() => onDelete(user.id)}
                        >
                          <i className="bi bi-trash" aria-hidden="true"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}