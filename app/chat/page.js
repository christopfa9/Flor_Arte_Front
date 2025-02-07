'use client';

import Card from '@mui/material/Card';
import axios from 'axios';
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation'
import { useShoppingCartStore } from "@/stores/shoppingcart-store";
import {getProduct} from "@/services/ProductService";
import {consultAI} from "@/services/AiSercice";

export default function Page() {
    const [messages, setMessages] = useState([{ type: 'answer', content: "Hola, ¿en qué puedo ayudarte?" }]);
    const form = useForm({});
    const { register, handleSubmit, formState, reset } = form;
    const { errors } = formState;
    const router = useRouter();

    const addItem = useShoppingCartStore(state => state.addItem);

    useEffect(() => {
        console.log("Mensajes: ", messages);
    }, [messages]);

    const newOrder = () => {
        router.push('/shopping-cart');
    }

    const sendQuestion = async (data) => {
        const newQuestion = {
            type: 'question',
            content: data.question,
        };
    
        setMessages([...messages, newQuestion]);
    
        try {
            const result = await consultAI(data.question);
           
            try {
                let parsedAnswer;
                if (typeof result.answer === "string" && (result.answer.trim().startsWith("{") || result.answer.trim().startsWith("["))) {
                    parsedAnswer = JSON.parse(result.answer);
                } else {
                    parsedAnswer = result.answer;
                }
            
                if (parsedAnswer && parsedAnswer.productos && Array.isArray(parsedAnswer.productos) && parsedAnswer.productos.length > 0) {
                    reset();
                    for (const producto of parsedAnswer.productos) {
                        const product = await getProduct(producto.id);
                        addItem({ 
                            product: product, 
                            quantity: producto.cantidad || 1  
                        });
                    }
                    router.push('/shopping-cart');
                } else {
                    const newAnswer = {
                        type: 'answer',
                        content: parsedAnswer || "Respuesta no disponible",
                    };
            
                    setMessages((prevMessages) => [...prevMessages, newAnswer]);
                    reset();
                }
            } catch (error) {
                console.error("Error al parsear `answer` o `productos`:", error);
            }

            
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    return (
        <>
            <Card 
                sx={{ 
                    maxWidth: 1000, 
                    margin: '0 auto', 
                    padding: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    textAlign: 'center'
                }}
            >
                <div className="chat-window">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.type}`}>
                            {message.type === 'question' ? <strong>Pregunta:</strong> : <strong>Respuesta:</strong>} {message.content}
                        </div>
                    ))}
                </div>

                <form
                    onSubmit={handleSubmit(sendQuestion)}
                    noValidate
                    className='col-span-8 flex flex-col gap-y-5 my-4 items-center'
                    style={{ width: '100%' }}
                >
                    <div className='flex flex-col' style={{ width: '100%' }}> 
                        <TextField
                            id="question"
                            label="Escribe tu pregunta"
                            variant="filled"
                            multiline
                            rows={3}
                            inputProps={{
                                type: "text",
                            }}
                            {...register('question', {
                                required: 'Pregunta es requerida',
                            })}
                            error={!!errors.question}
                            helperText={errors.question?.message}
                        />
                    </div>
                    <div className='flex justify-between' style={{ width: '100%' }}>
                        <Button className='w-1/2' type='submit' variant='contained' style={{ marginRight: '10px'}}>
                            Enviar 
                        </Button>
                    </div>
                </form>   
            </Card>

            <style jsx>{`
                .chat-window {
                    max-height: 500px;
                    overflow-y: auto;
                    width: 100%;
                    border: 1px solid #ccc;
                    padding: 10px;
                    margin-bottom: 20px;
                }
                .message {
                    margin: 10px 0;
                    padding: 10px;
                    border-radius: 5px;
                }
                .question {
                    background-color: #e0f7fa;
                    text-align: right;
                }
                .answer {
                    background-color: #f1f8e9;
                    text-align: left;
                }
            `}</style>
        </>
    );
}
