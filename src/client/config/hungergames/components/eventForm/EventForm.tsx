import React, { useCallback, useEffect, useMemo, useState } from 'react';
import IEventFormProps, { IEventFormParams } from './IEventFormProps';
import { useHistory, useParams } from 'react-router-dom';
import IEvent from '../../../../../server/modules/games/hungerGames/database/schema/IEvent';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import styles from './EventForm.module.scss';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Select from '@material-ui/core/Select';
import EventType from '../../../../../server/modules/games/hungerGames/events/EventType';
import Positive from '../../../../../server/modules/games/hungerGames/events/Positive';
import { startCase } from 'lodash';
import Negative from '../../../../../server/modules/games/hungerGames/events/Negative';
import Neutral from '../../../../../server/modules/games/hungerGames/events/Neutral';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import MinMax from '../../../../../server/utils/MinMax';
import { Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

function getEnumAsPickable(
  choiceSet: typeof Positive | typeof Neutral | typeof Negative
) {
  return Object.keys(choiceSet)
    .map(k => choiceSet[k as any])
    .filter(k => typeof k === 'number')
    .map((key: any) => ({ key, text: startCase(choiceSet[key]) }));
}

export function getCategories(type: EventType) {
  switch (type) {
    case EventType.Positive:
      return getEnumAsPickable(Positive);
    case EventType.Neutral:
      return getEnumAsPickable(Neutral);
    case EventType.Negative:
      return getEnumAsPickable(Negative);
  }
}

const EventForm: React.FC<IEventFormProps> = ({ eventService }) => {
  const { id } = useParams<IEventFormParams>();
  const { push } = useHistory();

  const [description, setDescription] = useState('');
  const [type, setType] = useState<EventType>(EventType.Positive);
  const [category, setCategory] = useState<Positive | Negative | Neutral>(0);

  const [health, setHealth] = useState(
    new MinMax(0, 0, { lowerBound: -100, upperBound: 100 })
  );
  const [hunger, setHunger] = useState(
    new MinMax(0, 0, { lowerBound: -100, upperBound: 100 })
  );
  const [stamina, setStamina] = useState(
    new MinMax(0, 0, { lowerBound: -100, upperBound: 100 })
  );

  const [requireWeapon, setRequireWeapon] = useState<
    'true' | 'false' | 'ignore'
  >('ignore');

  const [requireArmour, setRequireArmour] = useState<
    'true' | 'false' | 'ignore'
  >('ignore');

  const [requireFood, setRequireFood] = useState(
    new MinMax(0, 5, { lowerBound: 0, upperBound: 5 })
  );

  const [requireHealth, setRequireHealth] = useState(
    new MinMax(0, 100, { lowerBound: 0, upperBound: 100 })
  );
  const [requireHunger, setRequireHunger] = useState(
    new MinMax(0, 100, { lowerBound: 0, upperBound: 100 })
  );
  const [requireStamina, setRequireStamina] = useState(
    new MinMax(0, 100, { lowerBound: 0, upperBound: 100 })
  );

  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (id) {
      eventService
        .getOne(id)
        .then((event: IEvent) => {
          setDescription(event.description);
          setType(event.type);
          setCategory(event.category || 0);

          if (event.statChanges) {
            const {
              health: eventHealth,
              hunger: eventHunger,
              stamina: eventStamina
            } = event.statChanges;

            if (eventHealth?.length) {
              setHealth(health.set(eventHealth[0], eventHealth[1]));
            }

            if (eventHunger?.length) {
              setHunger(hunger.set(eventHunger[0], eventHunger[1]));
            }

            if (eventStamina?.length) {
              setStamina(stamina.set(eventStamina[0], eventStamina[1]));
            }
          }

          if (event.requirements) {
            const r = event.requirements;
            if (r.weapon !== undefined) {
              setRequireWeapon(r.weapon ? 'true' : 'false');
            }

            if (r.armour !== undefined) {
              setRequireArmour(r.armour ? 'true' : 'false');
            }

            if (r.food?.length) {
              setRequireFood(requireFood.set(r.food[0], r.food[1]));
            }

            if (r.health?.length) {
              setRequireHealth(requireHealth.set(r.health[0], r.health[1]));
            }

            if (r.hunger?.length) {
              setRequireHunger(requireHunger.set(r.hunger[0], r.hunger[1]));
            }

            if (r.stamina?.length) {
              setRequireStamina(requireStamina.set(r.stamina[0], r.stamina[1]));
            }
          }
        })
        .catch(setError);
    }
  }, [eventService]);

  const onUpdate = useCallback(() => {
    const updateBody: Partial<IEvent> = {
      description,
      type,
      category,
      statChanges: {
        health: [
          parseInt(health.min.toString()),
          parseInt(health.max.toString())
        ],
        hunger: [
          parseInt(hunger.min.toString()),
          parseInt(hunger.max.toString())
        ],
        stamina: [
          parseInt(stamina.min.toString()),
          parseInt(hunger.max.toString())
        ]
      }
    };
    if (id) {
      eventService.update(id, updateBody).then(() => push('/events'));
    } else {
      eventService
        .add(updateBody)
        .then(() => push('/events'))
        .catch(setError);
    }
  }, [eventService, id]);

  const onDelete = useCallback(() => {
    if (id) {
      eventService
        .delete(id)
        .then(() => push('/items'))
        .catch(setError);
    }
  }, [eventService]);
  ``;

  const categories = useMemo(() => getCategories(type), [type]);

  return (
    <>
      <Container component={Paper} className={styles.container}>
        <FormGroup className={styles.formGroup}>
          <FormLabel>Description</FormLabel>
          <TextField
            value={description}
            onChange={ev => setDescription(ev.target.value)}
            multiline={true}
            rows={4}
          />
          <FormHelperText>The following variables can be used:</FormHelperText>
          <FormHelperText>
            %name% %victor% %loser% %weapon% %armour% %food%
          </FormHelperText>
        </FormGroup>
        <FormGroup className={styles.formGroup}>
          <FormLabel>Event Type</FormLabel>
          <RadioGroup
            value={type}
            onChange={ev => setType(parseInt(ev.target.value) as EventType)}
          >
            <FormControlLabel
              value={EventType.Positive}
              control={<Radio />}
              label='Positive'
            />
            <FormControlLabel
              value={EventType.Neutral}
              control={<Radio />}
              label='Neutral'
            />
            <FormControlLabel
              value={EventType.Negative}
              control={<Radio />}
              label='Negative'
            />
            <FormControlLabel
              value={EventType.Encounter}
              control={<Radio />}
              label='Encounter'
            />
          </RadioGroup>
        </FormGroup>
        {categories && (
          <FormGroup className={styles.formGroup}>
            <FormLabel>Event Category</FormLabel>
            <Select
              value={category}
              onChange={ev =>
                setCategory(ev.target.value as Positive | Neutral | Negative)
              }
            >
              {categories.map(category => (
                <MenuItem key={category.key} value={category.key}>
                  {category.text}
                </MenuItem>
              ))}
            </Select>
          </FormGroup>
        )}
      </Container>
      {type !== EventType.Encounter && (
        <Container component={Paper} className={styles.container}>
          <FormGroup className={styles.formGroup}>
            <FormLabel>Health Changes</FormLabel>
            <FormControl className={styles.minMax}>
              <TextField
                type={'number'}
                label={'min'}
                value={health.min}
                onChange={ev => setHealth(health.setMin(ev.target.value))}
              />
              <TextField
                type={'number'}
                label={'max'}
                value={health.max}
                onChange={ev => setHealth(health.setMax(ev.target.value))}
              />
            </FormControl>
          </FormGroup>
          <FormGroup className={styles.formGroup}>
            <FormLabel>Hunger Changes</FormLabel>
            <FormControl className={styles.minMax}>
              <TextField
                type={'number'}
                label={'min'}
                value={hunger.min}
                onChange={ev => setHunger(hunger.setMin(ev.target.value))}
              />
              <TextField
                type={'number'}
                label={'max'}
                value={hunger.max}
                onChange={ev => setHunger(hunger.setMax(ev.target.value))}
              />
            </FormControl>
          </FormGroup>
          <FormGroup className={styles.formGroup}>
            <FormLabel>Stamina Changes</FormLabel>
            <FormControl className={styles.minMax}>
              <TextField
                type={'number'}
                label={'min'}
                value={stamina.min}
                onChange={ev => setStamina(stamina.setMin(ev.target.value))}
              />
              <TextField
                type={'number'}
                label={'max'}
                value={stamina.max}
                onChange={ev => setStamina(stamina.setMax(ev.target.value))}
              />
            </FormControl>
          </FormGroup>
        </Container>
      )}
      <Container component={Paper} className={styles.container}>
        <FormGroup className={styles.formGroup}>
          <FormLabel>Require Weapon</FormLabel>
          <Select
            value={requireWeapon}
            onChange={ev =>
              setRequireWeapon(ev.target.value as 'true' | 'false' | 'ignore')
            }
          >
            <MenuItem value={'ignore'}>Any</MenuItem>
            <MenuItem value={'true'}>Must Have Weapon</MenuItem>
            <MenuItem value={'false'}>Must Not Have Weapon</MenuItem>
          </Select>
        </FormGroup>
        <FormGroup className={styles.formGroup}>
          <FormLabel>Require Armour</FormLabel>
          <Select
            value={requireArmour}
            onChange={ev =>
              setRequireArmour(ev.target.value as 'true' | 'false' | 'ignore')
            }
          >
            <MenuItem value={'ignore'}>Any</MenuItem>
            <MenuItem value={'true'}>Must Have Armour</MenuItem>
            <MenuItem value={'false'}>Must Not Have Armour</MenuItem>
          </Select>
        </FormGroup>
        <FormGroup className={styles.formGroup}>
          <FormLabel>Require Food</FormLabel>
          <FormControl className={styles.minMax}>
            <TextField
              type={'number'}
              label={'min'}
              value={requireFood.min}
              onChange={ev =>
                setRequireFood(requireFood.setMin(ev.target.value))
              }
            />
            <TextField
              type={'number'}
              label={'max'}
              value={requireFood.max}
              onChange={ev =>
                setRequireFood(requireFood.setMax(ev.target.value))
              }
            />
          </FormControl>
        </FormGroup>
        <FormGroup className={styles.formGroup}>
          <FormLabel>Require Health</FormLabel>
          <FormControl className={styles.minMax}>
            <TextField
              type={'number'}
              label={'min'}
              value={requireHealth.min}
              onChange={ev =>
                setRequireFood(requireHealth.setMin(ev.target.value))
              }
            />
            <TextField
              type={'number'}
              label={'max'}
              value={requireHealth.max}
              onChange={ev =>
                setRequireFood(requireHealth.setMax(ev.target.value))
              }
            />
          </FormControl>
        </FormGroup>
        <FormGroup className={styles.formGroup}>
          <FormLabel>Require Hunger</FormLabel>
          <FormControl className={styles.minMax}>
            <TextField
              type={'number'}
              label={'min'}
              value={requireHunger.min}
              onChange={ev =>
                setRequireFood(requireHunger.setMin(ev.target.value))
              }
            />
            <TextField
              type={'number'}
              label={'max'}
              value={requireHunger.max}
              onChange={ev =>
                setRequireFood(requireHunger.setMax(ev.target.value))
              }
            />
          </FormControl>
        </FormGroup>
        <FormGroup className={styles.formGroup}>
          <FormLabel>Require Stamina</FormLabel>
          <FormControl className={styles.minMax}>
            <TextField
              type={'number'}
              label={'min'}
              value={requireStamina.min}
              onChange={ev =>
                setRequireFood(requireStamina.setMin(ev.target.value))
              }
            />
            <TextField
              type={'number'}
              label={'max'}
              value={requireStamina.max}
              onChange={ev =>
                setRequireFood(requireStamina.setMax(ev.target.value))
              }
            />
          </FormControl>
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

export default EventForm;
