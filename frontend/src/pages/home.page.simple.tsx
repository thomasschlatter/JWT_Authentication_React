import { Box, Container, Grid } from '@mui/material';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import FullScreenLoader from '../components/FullScreenLoader';
import Message from '../components/Message';
import ClassroomItem from '../components/classroom/classroom.component';
import { useGetAllClassroomsQuery } from '../redux/api/classroomApi';

const HomePage = () => {
  const { isLoading, isError, error, data: classrooms } = useGetAllClassroomsQuery();

  useEffect(() => {
    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: 'top-right',
          })
        );
      } else {
        console.log(classrooms)
        toast.error((error as any).data.message, {
          position: 'top-right',
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <Container
      maxWidth={false}
      sx={{ backgroundColor: '#2363eb', height: '100vh' }}
    >
    </Container>
  );
};

export default HomePage;
