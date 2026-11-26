import { useState } from 'react'
import DeleteMovieModal from '../../components/admin/DeleteMovieModal'
import UserFormModal from '../../components/admin/users/UserFormModal'
import UserTable from '../../components/admin/users/UserTable'
import { useAuth } from '../../hooks/useAuth'
import { useUsers } from '../../hooks/useUsers'
import type { User } from '../../types/user'

export default function AdminUsersPage() {
  const { users, updateUsers } = useUsers()
  const { loggedUser } = useAuth()
  const canDelete = loggedUser?.role === 'admin'

  const registeredUsers = users.filter((user) => user.role === 'subscriber')
  const [userToEditId, setUserToEditId] = useState('')
  const [userToDeleteId, setUserToDeleteId] = useState('')

  const userToEdit = users.find((user) => user.id === userToEditId)
  const userToDelete = users.find((user) => user.id === userToDeleteId)

  function handleSaveUser(updatedUser: User) {
    updateUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
    )
    setUserToEditId('')
  }

  function handleConfirmDeleteUser() {
    updateUsers(users.filter((user) => user.id !== userToDeleteId))
    setUserToDeleteId('')
  }

  return (
    <>
      <UserTable
        users={registeredUsers}
        onEdit={setUserToEditId}
        onDelete={setUserToDeleteId}
        canDelete={canDelete}
      />

      {userToEdit && (
        <UserFormModal
          user={userToEdit}
          onClose={() => setUserToEditId('')}
          onSave={handleSaveUser}
        />
      )}

      <DeleteMovieModal
        open={userToDelete !== undefined}
        title="Eliminar usuario"
        confirmLabel="Eliminar"
        onCancel={() => setUserToDeleteId('')}
        onConfirm={handleConfirmDeleteUser}
      >
        ¿Seguro que querés eliminar a <strong>{userToDelete?.email}</strong>? Ya
        no va a poder iniciar sesión. Esta acción no se puede deshacer.
      </DeleteMovieModal>
    </>
  )
}
