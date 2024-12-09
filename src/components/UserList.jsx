// UserList.js
import React, { useState, useEffect } from 'react';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [newUserName, setNewUserName] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiUrl = "https://675750afc0a427baf94c758f.mockapi.io/api/id"; // Reemplaza con la URL de tu API de MockAPI.io

    useEffect(() => {
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error("Error al obtener usuarios:", error))
            .finally(() => {
                setLoading(false);
            });
    }, [apiUrl]);
    const handleCreateUser = () => {
        // Realizar solicitud POST para agregar un nuevo usuario
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newUserName }),
        })
            .then((response) => response.json())
            .then(() => {
                // Realizar cualquier acción adicional si es necesario
                setNewUserName('');
            })
            .then(() => {
                // Realizar solicitud GET después de crear un usuario para obtener datos actualizados
                return fetch(apiUrl);
            })
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error(error.message));
    };
    const handleUpdateUser = () => {
        if (!selectedUser) return;

        // Realizar solicitud PUT para actualizar un usuario existente
        fetch(`${apiUrl}/${selectedUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newUserName }),
        })
            .then((response) => response.json())
            .then((updatedUser) => {
                // Actualizar el estado con el usuario actualizado
                setUsers(users.map((user) => (user.id === selectedUser.id ? updatedUser : user)));
                setNewUserName('');
                setSelectedUser(null);
            })
            .catch((error) => console.error('Error al actualizar usuario:', error));
    };
    const handleDeleteUser = (userId) => {
        // Realizar solicitud DELETE para eliminar un usuario
        fetch(`${apiUrl}/${userId}`, {
            method: 'DELETE',
        })
            .then(() => {
                // Actualizar el estado excluyendo al usuario eliminado
                setUsers(users.filter((user) => user.id !== userId));
                setNewUserName('');
                setSelectedUser(null);
            })
            .catch((error) => console.error('Error al eliminar usuario:', error));
    };
    return (
        <div>
            <h2>Lista de Usuarios</h2>
            {loading ?
                (<h1>Cargando...</h1>) :
                (<ul>
                    {users.map((user) => (
                        <li key={user.id}>
                            {user.name}
                            <button onClick={() => setSelectedUser(user)}>Seleccionar para editar</button>
                            <button onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>)}

            <div>
                <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Nombre del Usuario" />
                {selectedUser ? (
                    <button onClick={handleUpdateUser}>Actualizar Usuario</button>
                ) : (
                    <button onClick={handleCreateUser}>Crear Usuario</button>
                )}
            </div>
        </div>
    );
};

export default UserList;