import React, { useCallback, useEffect, useState } from 'react';
import styles from './ItemForm.module.scss';
import IItemFormProps, { IItemFormParms } from './IItemFormProps';
import { useParams, useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import ItemType from '../../../../../server/modules/games/hungerGames/items/ItemType';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import IItem from '../../../../../server/modules/games/hungerGames/database/schema/IItem';
import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';

const ItemForm: React.FC<IItemFormProps> = ({ itemService }) => {
  const { id } = useParams<IItemFormParms>();
  const { push } = useHistory();

  const [name, setName] = useState('');
  const [strength, setStrength] = useState(0);
  const [type, setType] = useState(ItemType.Weapon);

  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (id) {
      itemService
        .getOne(id)
        .then((item: IItem) => {
          setName(item.name);
          setStrength(item.strength);
          setType(item.type);
        })
        .catch(setError);
    }
  }, [itemService]);

  const onUpdate = useCallback(() => {
    if (id) {
      itemService
        .update(id, { name, strength, type })
        .then(() => push('/items'));
    } else {
      itemService
        .add({ name, strength, type })
        .then(() => push('/items'))
        .catch(setError);
    }
  }, [itemService, name, strength, type, id]);

  const onDelete = useCallback(() => {
    if (id) {
      itemService
        .delete(id)
        .then(() => push('/items'))
        .catch(setError);
    }
  }, [itemService]);

  return (
    <>
      <Container component={Paper} className={styles.container}>
        <FormGroup className={styles.formGroup}>
          <FormLabel>Name</FormLabel>
          <TextField value={name} onChange={ev => setName(ev.target.value)} />
        </FormGroup>
        <FormGroup className={styles.formGroup}>
          <FormLabel>Strength</FormLabel>
          <TextField
            type={'number'}
            value={strength}
            onChange={ev => setStrength(parseInt(ev.target.value))}
          />
        </FormGroup>
        <FormGroup className={styles.formGroup}>
          <FormLabel>Item Type</FormLabel>
          <RadioGroup
            value={type}
            onChange={ev => setType(parseInt(ev.target.value) as ItemType)}
          >
            <FormControlLabel
              value={ItemType.Weapon}
              control={<Radio />}
              label='Weapon'
            />
            <FormControlLabel
              value={ItemType.Armour}
              control={<Radio />}
              label='Armour'
            />
            <FormControlLabel
              value={ItemType.Food}
              control={<Radio />}
              label='Food'
            />
          </RadioGroup>
        </FormGroup>
      </Container>
      <Container component={Paper} className={styles.container}>
        <FormGroup className={styles.formGroup}>
          <Button variant='contained' color='primary' onClick={onUpdate}>
            Save
          </Button>
        </FormGroup>
        {id && (
          <FormGroup className={styles.formGroup}>
            <Button variant='contained' color='secondary' onClick={onDelete}>
              Delete
            </Button>
          </FormGroup>
        )}
        {error && <Alert severity='error'>{error.message}</Alert>}
      </Container>
    </>
  );
};

export default ItemForm;
