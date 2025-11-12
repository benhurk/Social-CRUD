# Social CRUD

App de rede social estilo Twitter completo com criação e interações em posts, autenticação JWT e edição de perfil.

**Frontend:**

- React (Vite)
- Tailwind CSS
- Axios
- Zustand

**Backend:**

- Django Rest Framework
- SimpleJWT
- SQLite

### Requisitos

- Python 12+
- Node.js v24+

### Como rodar localmente

```bash
git clone https://github.com/benhurk/Social-CRUD.git
cd Social-Crud

#Frontend:
cd frontend
npm install
npm run dev

#Backend:
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

##### Variáveis de ambiente

- **frontend/.env:**
  VITE_API_BASE_URL=<http://127.0.0.1:8000/api>

- **backend/.env:**
  DJANGO_SECRET_KEY=your-secret-key
  DEBUG=True
  ALLOWED_HOSTS=127.0.0.1,localhost

##### URLs

- Frontend: <http://localhost:5173/>
- Backend: <http://127.0.0.1:8000/>

### Rotas da API

**Usuários**

| Método  | Endpoint                                | Descrição                                  |
| ------- | --------------------------------------- | ------------------------------------------ |
| `POST`  | `/auth/register/`                       | Registrar novo usuário                     |
| `POST`  | `/auth/token/`                          | Obter token de autenticação                |
| `POST`  | `/auth/token/refresh/`                  | Atualizar token de autenticação            |
| `PATCH` | `/auth/profile/`                        | Atualizar informações do perfil do usuário |
| `POST`  | `/auth/change-password/`                | Mudar a senha do usuário                   |
| `GET`   | `/auth/users/`                          | Listar usuários                            |
| `GET`   | `/auth/users/<username>/`               | Obter perfil de um usuário                 |
| `POST`  | `/auth/users/<username>/follow-toggle/` | Seguir / Deixar de seguir um usuário       |
| `GET`   | `/auth/users/<username>/following/`     | Listar usuário seguidos                    |
| `GET`   | `/auth/users/<username>/followers/`     | Listar seguidores                          |

**Posts:**

| Método   | Endpoint                            | Descrição                                  |
| -------- | ----------------------------------- | ------------------------------------------ |
| `GET`    | `/feed/`                            | Listar todos os posts de usuários seguidos |
| `POST`   | `/posts/`                           | Criar novo post                            |
| `GET`    | `/posts/<id>/`                      | Obter post específico                      |
| `DELETE` | `/posts/<id>/`                      | Apagar post                                |
| `POST`   | `/posts/<id>/like/`                 | Alterar like em um post                    |
| `GET`    | `/posts/<id>/like/`                 | Verificar status de like de um usuário     |
| `GET`    | `/posts/<id>/comments/`             | Obter comentários de um post               |
| `POST`   | `/posts/<id>/comments/`             | Criar novo comentário em um post           |
| `DELETE` | `/posts/<id>/comments/<comment_id>` | Apagar comentário                          |

### Links

- Frontend: <https://social-crud.vercel.app>
- API: <https://benhurk.pythonanywhere.com>
