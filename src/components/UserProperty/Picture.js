import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Image, Spinner, FormControl, FormLabel, FormHelperText, TextInput } from '@codeday/topo/Atom';
import { useToasts } from '@codeday/topo/utils';
import { tryAuthenticatedApiQuery } from '../../util/api';
import { UserPictureMutation } from './Picture.gql';

const uploadPicture = async (file, token, id) => {
  const { result, error } = await tryAuthenticatedApiQuery(UserPictureMutation, { id, upload: file }, token);
  return !error ? { url: result?.account?.uploadProfilePicture } : { error };
};

const WARN_FILE_SIZE = 1024 * 1024 * 5;
const MAX_FILE_SIZE = 1024 * 1024 * 125;
const MIME_IMAGE = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

const Picture = ({ user, onChange, token }) => {
  const uploaderRef = useRef(null);
  const [pictureUrl, setPictureUrl] = useState(user.picture);
  const [uploading, setUploading] = useState(false);
  const { success, error, info } = useToasts();

  return (
    <FormControl>
      <FormLabel fontWeight="bold">Show us what you look like!</FormLabel>
      {uploading ? (
        <Spinner />
      ) : (
        <>
          <Image src={pictureUrl} rounded="full" height="100px" onClick={() => uploaderRef.current.click()} />
          <TextInput
            type="file"
            ref={uploaderRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={async (e) => {
              const file = e.target.files[0];

              if (!file) return;

              // Is the file supported?
              let type = null;
              if (MIME_IMAGE.includes(file.type)) type = 'IMAGE';
              if (!type) {
                error('Only images are supported.');
                return;
              }

              // Is the file really big.
              if (file.size > MAX_FILE_SIZE) {
                error(
                  `You might have a problem uploading files larger than ${Math.floor(MAX_FILE_SIZE / (1024 * 1024))}MB`,
                );
              }

              const reader = new FileReader();
              reader.onload = function (el) {
                setPictureUrl(el.target.result);
              };
              reader.readAsDataURL(file);

              if (file.size > WARN_FILE_SIZE) {
                info(
                  `Your file is uploading, but at ${Math.floor(file.size / (1024 * 1024))}MB, it might take a while.`,
                );
              } else {
                info(`Your file is uploading.`);
              }
              try {
                const result = await uploadPicture(file, token, user.id);
                success('Picture uploaded!');
                setPictureUrl(result.url);
              } catch (err) {
                console.error(err);
                setUploading(false);
              }
              setUploading(false);
            }}
          />
        </>
      )}
      <FormHelperText>
        Upload a picture of yourself if you&apos;d like. Max 2MB, and it will be cropped to a square.
      </FormHelperText>
    </FormControl>
  );
};
Picture.propTypes = {
  user: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};
Picture.provides = 'picture';
export default Picture;
