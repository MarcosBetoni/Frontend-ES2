import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Members } from './pages/Members';
import { MeetingDetails } from './pages/MeetingDetails';
import { CreateMeeting } from './pages/CreateMeeting';
import { Login } from './pages/Login';
import RequireAuth from './components/auth/RequireAuth';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Layout>
                  <Home />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/membros"
            element={
              <RequireAuth>
                <Layout>
                  <Members />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/meetings/new"
            element={
              <RequireAuth>
                <Layout>
                  <CreateMeeting />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/meetings/:id"
            element={
              <RequireAuth>
                <Layout>
                  <MeetingDetails />
                </Layout>
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}