import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nameSchema } from '@/schema/nameSchema';
import { useName } from '@/hooks/useName';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { RegExpMatcher, TextCensor, englishDataset, englishRecommendedTransformers, asteriskCensorStrategy } from 'obscenity';
import { Loader2 } from 'lucide-react';

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

const censor = new TextCensor().setStrategy(asteriskCensorStrategy());

const EnterNameModal = ({ onClose }: { onClose: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isOpen, onClose: closeModal } = useName();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: '' },
  });

  const onSubmit = async (data: { name: string }) => {
    const matches = matcher.getAllMatches(data.name);
    if (matches.length > 0) {
      setError('name', {
        type: 'manual',
        message: 'Name contains inappropriate language.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/updateUser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: data.name }),
      });

      if (!response.ok) {
        throw new Error('Failed to save name');
      }

      console.log('Name saved successfully');

      // Force a session update to fetch the latest user information
      await getSession();

      closeModal();
      onClose();
      // Force a full page refresh
      window.location.reload();
    } catch (error) {
      console.error('Error saving name:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      clearErrors('name');
      setErrorMessage(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex justify-center items-center bg-black/50'>
      <div className='flex flex-col justify-center items-center gap-4 bg-white w-full max-w-md p-8 rounded-lg shadow-lg'>
        <h1 className='font-semibold text-xl text-[#2E2A47]'>Welcome to the Math Tutorial Center</h1>
        <p className='text-sm text-[#7E8CA0]'>Please enter your name to continue</p>
        <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-4'>
            <input
              id='name'
              className={`shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-gray-400 ${
                errors.name ? 'border-rose-500' : ''
              }`}
              type='text'
              {...register('name')}
              onChange={handleInputChange}
              placeholder='John Doe'
            />
            {errors.name && <p className='text-rose-500 text-xs mt-1'>{errors.name.message}</p>}
          </div>
          {errorMessage && <p className='text-rose-500 text-xs mb-4'>{errorMessage}</p>}
          <button
            className='bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline flex items-center justify-center'
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='animate-spin mr-2' size={18} />
              </>
            ) : (
              'Submit'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnterNameModal;