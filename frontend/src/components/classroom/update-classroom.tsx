import {
  Box,
  CircularProgress,
  TextareaAutosize,
  TextField,
  Typography,
} from '@mui/material';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { object, string, TypeOf, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FileUpload from '../FileUpload/FileUpload';
import { LoadingButton } from '@mui/lab';
import { FC, useEffect } from 'react';
import { pickBy } from 'lodash';
import { toast } from 'react-toastify';
import { useUpdateClassroomMutation } from '../../redux/api/classroomApi';
import { IClassroom } from '../../redux/api/types';

interface IUpdateClassroomProp {
  setOpenClassroomModal: (openClassroomModal: boolean) => void;
  classroom: IClassroom;
}

const updateClassroomSchema = object({
  title: string(),
  content: string().max(50),
  category: string().max(50),
  image: z.instanceof(File),
}).partial();

type IUpdateClassroom = TypeOf<typeof updateClassroomSchema>;

const UpdateClassroom: FC<IUpdateClassroomProp> = ({ setOpenClassroomModal, classroom }) => {
  const [updateClassroom, { isLoading, isError, error, isSuccess }] =
    useUpdateClassroomMutation();

  const methods = useForm<IUpdateClassroom>({
    resolver: zodResolver(updateClassroomSchema),
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Classroom updated successfully');
      setOpenClassroomModal(false);
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

  useEffect(() => {
    if (methods.formState.isSubmitting) {
      methods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methods.formState.isSubmitting]);

  useEffect(() => {
    if (classroom) {
      methods.reset({
        title: classroom.title,
        category: classroom.category,
        content: classroom.description,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroom]);

  const onSubmitHandler: SubmitHandler<IUpdateClassroom> = (values) => {
    const formData = new FormData();
    const filteredFormData = pickBy(
      values,
      (value) => value !== '' && value !== undefined
    );
    const { image, ...otherFormData } = filteredFormData;
    if (image) {
      formData.append('image', image);
    }
    formData.append('data', JSON.stringify(otherFormData));
    updateClassroom({ id: classroom?.id!, classroom: formData });
  };

  return (
    <Box>
      <Box display='flex' justifyContent='space-between' sx={{ mb: 3 }}>
        <Typography variant='h5' component='h1'>
          Edit Classroom
        </Typography>
        {isLoading && <CircularProgress size='1rem' color='primary' />}
      </Box>
      <FormProvider {...methods}>
        <Box
          component='form'
          noValidate
          autoComplete='off'
          onSubmit={methods.handleSubmit(onSubmitHandler)}
        >
          <TextField
            label='Title'
            fullWidth
            sx={{ mb: '1rem' }}
            {...methods.register('title')}
          />
          <TextField
            label='Category'
            fullWidth
            sx={{ mb: '1rem' }}
            {...methods.register('category')}
          />
          <Controller
            name='content'
            control={methods.control}
            defaultValue=''
            render={({ field }) => (
              <TextareaAutosize
                {...field}
                placeholder='Classroom Details'
                minRows={8}
                style={{
                  width: '100%',
                  border: '1px solid #c8d0d4',
                  fontFamily: 'Roboto, sans-serif',
                  marginBottom: '1rem',
                  outline: 'none',
                  fontSize: '1rem',
                  padding: '1rem',
                }}
              />
            )}
          />
          <FileUpload limit={1} name='image' multiple={false} />
          <LoadingButton
            variant='contained'
            fullWidth
            sx={{ py: '0.8rem', mt: 4, backgroundColor: '#2363eb' }}
            type='submit'
            loading={isLoading}
          >
            Edit Classroom
          </LoadingButton>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default UpdateClassroom;
