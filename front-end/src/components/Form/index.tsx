import { Link, Redirect, useHistory } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { IFormProps } from '../../interfaces'
import { useForm } from 'react-hook-form'
import { api } from '../../services/api'
import { toast } from 'react-toastify'
import { Container } from './style'
import { Button } from '../Button'
import { useState } from 'react'
import * as yup from 'yup'
import { Input } from '../Input'


const Form = ({ apiProp, historyProp, titleProp, textProp, linkProp, setAuthentication, authentication }: IFormProps) => {

    const [ load, setLoad ] = useState<boolean>(false)

    const history = useHistory()

    const schema = yup.object().shape({
        
        username: yup
                .string()
                .min(3, 'Username must contain at least 3 characters'),
        password: yup
                .string()
                .min(8, 'Password must contain at least 8 characters')
                .matches(
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
                    'The password must contain capital letters and numbers!'
                )
    })

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

    const onSumbitFunction = (data: object) => {

        setLoad(true)
        
        api.post(`/${ apiProp }`, data, {
        
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => {

            if(apiProp == 'session') {

                localStorage.setItem('Project NG.CASH: token', res.data.token)

                setAuthentication(true)

                toast.success('Login completed')
            }

            if(apiProp == 'users') {

                toast.success('Register completed')
            }

            history.push(`/${ historyProp }`)
        })
        .catch(_ => toast.error('Oops! An error occured'))
        .finally(() => setLoad(false))
    }

    if(authentication) {

        return <Redirect to="/home" />
    }

    return (
        <Container onSubmit={ handleSubmit(onSumbitFunction) }>

            <h1>{ titleProp }</h1>

            <main>
                <Input
                placeholder="Username"
                type="text"
                name="username"
                register={ register }
                required={ true }
                error={ errors.username?.message as string }
                />

                <Input
                placeholder="Password"
                type="text"
                name="password"
                register={ register }
                required={ true }
                error={ errors.password?.message as string }
                />

                <Button buttonStyle="register" type="submit" disabled={ load }>{
                    load ? 'Sending...' : 'Submit'
                }</Button>
            </main>

            <p>{ textProp }<Link to={ `/${ linkProp }` }>click here</Link>.</p>

        </Container>
    )
}

export { Form }
