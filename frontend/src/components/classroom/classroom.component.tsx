import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { FC, useEffect, useState } from 'react';
import ClassroomModal from '../modals/classroom.modal';
import { useDeleteClassroomMutation } from '../../redux/api/classroomApi';
import { toast } from 'react-toastify';
import UpdateClassroom from './update-classroom';
import { IClassroom } from '../../redux/api/types';
import { format, parseISO } from 'date-fns';
import './classroom.styles.scss';

const SERVER_ENDPOINT = process.env.REACT_APP_SERVER_ENDPOINT;

interface IClassroomItemProps {
  classroom: IClassroom;
}

const PostItem: FC<IClassroomItemProps> = ({ classroom }) => {
  const [openClassroomModal, setOpenClassroomModal] = useState(false);
  const [deleteClassroom, { isLoading, error, isSuccess, isError }] =
    useDeleteClassroomMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success('Post deleted successfully');
    }

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

  const onDeleteHandler = (id: string) => {
    if (window.confirm('Are you sure')) {
      deleteClassroom(id);
    }
  };

  return (
    <>
      <Grid item xs={12} md={6} lg={4}>
        <Card sx={{ maxWidth: 345, overflow: 'visible' }}>
          <CardMedia
            component='img'
            height='250'
            image={`${SERVER_ENDPOINT}/api/static/posts/${classroom.image}`}
            alt='green iguana'
            sx={{ p: '1rem 1rem 0' }}
          />
          <CardContent>
            <Typography
              gutterBottom
              variant='h5'
              component='div'
              sx={{ color: '#4d4d4d', fontWeight: 'bold', height: '64px' }}
            >
              {classroom.title.length > 50
                ? classroom.title.substring(0, 50) + '...'
                : classroom.title}
            </Typography>
            <Box display='flex' alignItems='center' sx={{ mt: '1rem' }}>
              <Typography
                variant='body1'
                sx={{
                  backgroundColor: '#dad8d8',
                  p: '0.1rem 0.4rem',
                  borderRadius: 1,
                  mr: '1rem',
                }}
              >
                {classroom.category}
              </Typography>
              <Typography
                variant='body2'
                sx={{
                  color: '#ffa238',
                }}
              >
                {format(parseISO(classroom.created_at), 'PPP')}
              </Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Box
              display='flex'
              justifyContent='space-between'
              width='100%'
              sx={{ px: '0.5rem' }}
            >
              <Box display='flex' alignItems='center'>
                <Avatar
                  alt='cart image'
                  src={`${SERVER_ENDPOINT}/api/static/users/${classroom.user.photo}`}
                />
                <Typography
                  variant='body2'
                  sx={{
                    ml: '1rem',
                  }}
                >
                  Codevo
                </Typography>
              </Box>
              <div className='post-settings'>
                <li>
                  <MoreHorizOutlinedIcon />
                </li>
                <ul className='menu'>
                  <li onClick={() => setOpenClassroomModal(true)}>
                    <ModeEditOutlineOutlinedIcon
                      fontSize='small'
                      sx={{ mr: '0.6rem' }}
                    />
                    Edit
                  </li>
                  <li onClick={() => onDeleteHandler(classroom.id)}>
                    <DeleteOutlinedIcon
                      fontSize='small'
                      sx={{ mr: '0.6rem' }}
                    />
                    Delete
                  </li>
                </ul>
              </div>
            </Box>
          </CardActions>
        </Card>
      </Grid>
      <ClassroomModal
        openClassroomModal={openClassroomModal}
        setOpenClassroomModal={setOpenClassroomModal}
      >
        <UpdateClassroom setOpenClassroomModal={setOpenClassroomModal} classroom={classroom} />
      </ClassroomModal>
    </>
  );
};

export default PostItem;
