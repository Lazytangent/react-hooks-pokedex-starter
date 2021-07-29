import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router-dom';

import { getSinglePokemon, getRandomEncounter, battle } from '../store/pokemon';
import PokemonItems from './PokemonItems';
import EditPokemonForm from './EditPokemonForm';
import EditItemForm from './EditItemForm';
import CreateItemForm from './CreateItemForm';

const PokemonDetail = () => {
  const { pokemonId } = useParams();
  const history = useHistory();
  const location = useLocation();

  const dispatch = useDispatch();
  const pokemon = useSelector(state => state.pokemon[pokemonId]);

  const [showEditPokeForm, setShowEditPokeForm] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [createItem, setCreateItem] = useState(false);

  const triggerRandomEncounter = async () => {
    const pokemon = await dispatch(getRandomEncounter());
    history.push(`/pokemon/${pokemon.id}`, { status: 'encounter', allyId: pokemonId });
  };

  const triggerDifferentEncounter = async () => {
    const pokemon = await dispatch(getRandomEncounter());
    history.push(`/pokemon/${pokemon.id}`, { status: 'encounter', allyId: location.state.allyId });
  };

  const triggerBattle = async () => {
    const pokemon = await dispatch(battle(location.state.allyId, pokemonId));
    if (pokemon.captured) {
      history.replace(`/pokemon/${pokemon.id}`, { status: 'captured', allyId: location.state.allyId });
    }
  };

  const goBack = () => {
    history.push(`/pokemon/${location.state.allyId}`);
  };

  useEffect(() => {
    setShowEditPokeForm(false);
    setEditItemId(null);
    dispatch(getSinglePokemon(pokemonId));
  }, [pokemonId]);

  if (!pokemon || !pokemon.moves) {
    return null;
  }

  let content = null;

  if (editItemId) {
    content = (
      <EditItemForm pokemon={pokemon} itemId={editItemId} hideForm={() => setEditItemId(null)} />
    )
  } else if (showEditPokeForm && pokemon.captured) {
    content = (
      <EditPokemonForm pokemon={pokemon} hideForm={() => setShowEditPokeForm(false)} />
    )
  } else if (createItem) {
    content = (
      <CreateItemForm hideForm={() => setCreateItem(false)} />
    );
  } else {
    content = (
      <div className="pokemon-detail-lists">
        <div>
          <h2>Information</h2>
          <ul>
            <li>
              <b>No</b> {pokemon.no}
            </li>
            <li>
              <b>Type</b> {pokemon.type}
            </li>
            <li>
              <b>Attack</b> {pokemon.attack}
            </li>
            <li>
              <b>Defense</b> {pokemon.defense}
            </li>
            <li>
              <b>Moves</b>
              <ul>
                {pokemon.moves && pokemon.moves.map((move) => (
                  <li key={move}>{move}</li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
        <div>
          <h2>Items</h2>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Happiness</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <PokemonItems pokemon={pokemon} setEditItemId={setEditItemId} />
              <button onClick={() => setCreateItem(true)}>Create Item</button>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="pokemon-detail">
      <div className={`pokemon-detail-image-background`}>
        <div
          className="pokemon-detail-image"
          style={{ backgroundImage: `url('${pokemon.imageUrl}')` }}
        ></div>
        <div>
          <h1 className="bigger">{pokemon.name}</h1>
          {(!showEditPokeForm && pokemon.captured) && (
            <>
              <button onClick={() => setShowEditPokeForm(true)}>Edit</button>
              <button onClick={triggerRandomEncounter}>Random Encounter</button>
            </>
          )}
          {!pokemon.captured && location.state?.status === 'encounter' && (
            <>
              <button onClick={triggerDifferentEncounter}>Different Encounter</button>
              <button onClick={triggerBattle}>Battle</button>
            </>
          )}
          {location.state?.status === 'captured' && (
            <button onClick={goBack}>Go Back</button>
          )}
        </div>

      </div>
      {content}
    </div>
  );
};

export default PokemonDetail;
