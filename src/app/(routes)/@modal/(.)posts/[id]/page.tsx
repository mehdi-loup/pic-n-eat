import Modal from '@/components/Modal';
import ModalPostContent from '@/components/ModalPostContent';
import Preloader from '@/components/Preloader';
import { usePrivy } from '@privy-io/react-auth';
import { Suspense } from 'react';

export default async function PostInModal({ params: { id } }: { params: { id: string } }) {
  const { user } = usePrivy()
  return (
    <Modal>
      <Suspense fallback={<Preloader />}>
        {user ? <ModalPostContent postId={id} user={user} /> : <Preloader />}
      </Suspense>
    </Modal>
  );
}
