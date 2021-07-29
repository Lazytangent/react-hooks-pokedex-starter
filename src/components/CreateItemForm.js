import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { addItem } from '../store/items';

const CreateItemForm = ({ hideForm }) => {
  const { pokemonId } = useParams();
  const dispatch = useDispatch();

  const [happiness, setHappiness] = useState(0);
  const [price, setPrice] = useState(0);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const updateName = (e) => setName(e.target.value);
  const updateHappiness = (e) => setHappiness(e.target.value);
  const updatePrice = (e) => setPrice(e.target.value);
  const updateImageUrl = (e) => setImageUrl(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      happiness,
      price,
      imageUrl,
    };

    let updatedItem = await dispatch(addItem(payload, pokemonId));
    if (updatedItem) {
      hideForm();
    }
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    hideForm();
  };

  return (
    <section className="edit-form-holder centered middled">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={updateName} />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={updateImageUrl} />
        <input
          type="number"
          placeholder="Happiness"
          min="0"
          max="100"
          required
          value={happiness}
          onChange={updateHappiness} />
        <input
          type="number"
          placeholder="Price"
          required
          value={price}
          onChange={updatePrice} />
        <button type="submit">Create Item</button>
        <button type="button" onClick={handleCancelClick}>Cancel</button>
      </form>
    </section>
  );
};

export default CreateItemForm;
