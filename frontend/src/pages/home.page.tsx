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
        toast.error((error as any).data.message, {
          position: 'top-right',
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Container
      maxWidth={false}
      sx={{ backgroundColor: '#2363eb', height: '100vh' }}
    >
      {classrooms?.length === 0 ? (
        <Box maxWidth='sm' sx={{ mx: 'auto', py: '5rem' }}>
          <Message type='info' title='Info'>
            No Classrooms posted at the moment
          </Message>
        </Box>
      ) : (
        <Grid
          container
          rowGap={5}
          maxWidth='lg'
          sx={{
            margin: '0 auto',
            py: '5rem',
            gridAutoRows: 'max-content',
          }}
        >
            {classrooms?.map((classroom) => (
              <ClassroomItem key={classroom.id} classroom={classroom} />
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default HomePage;
