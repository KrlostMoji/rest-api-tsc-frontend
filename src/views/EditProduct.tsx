import { Link, Form, useActionData, ActionFunctionArgs, redirect, LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { getProductsById, updateProduct } from "../services/ProductService";
import { Product } from "../types";
import ProductForm from "../components/ProductForm";

export async function loader({params} : LoaderFunctionArgs){
  if(params.id!==undefined){
    const product = await getProductsById(+params.id)
    if(!product){
      return redirect('/')
    }
    return product 
  }
}

export async function action({request, params} : ActionFunctionArgs){
  const data = Object.fromEntries(await request.formData())
  let error = ''
  if(Object.values(data).includes('')){
    error='Favor de introducir los datos'
  }
  
  if(error.length){
    return error
  }

  if(params.id !== undefined){
    await updateProduct(data, +params.id)
    return redirect('/')
  }
  
}

const availableOptions = [
  { name: 'Disponible', value: true},
  { name: 'No Disponible', value: false}
]

const EditProduct = () => {

  const product = useLoaderData() as Product
  const error = useActionData() as string

  return (
    <>
      <div className='flex justify-between'>
        <h2 className='text-4xl font-black text-slate-500'>
          Edición de Productos
        </h2>
        <Link
          to='/'
          className='rounded-md bg-indigo-600 p-3 text-sm text-white shadow-sm hover:bg-indig-500'
        >
          Ver productos
        </Link>
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form
        className="mt-10" 
        method='POST'
        action=''     
      >
        <ProductForm 
          product={product}
        />
        <div className="mb-4">
          <label
            className="text-gray-800"
            htmlFor="available"
          >Disponibilidad:</label>
          <select 
            id="available"
            className="mt-2 block w-full p-3 bg-gray-50"
            name="available"
            defaultValue={product?.available.toString()}
          >
            {availableOptions.map(option => (
              <option key={option.name} value={option.value.toString()}>{option.name}</option>
            ))}
          </select>
        </div>
        <input
          type="submit"
          className="mt-5 w-full bg-indigo-600 p-2 text-white font-bold text-lg cursor-pointer rounded"
          value="Actualizar registro"
        />
      </Form>
    </>
  );
};

export default EditProduct;