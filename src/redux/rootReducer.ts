import { combineReducers } from 'redux';
import userReducer from './user/reduce';
import loadingReducer from './loading/reduce';
import notificacoesReducer from './notificacoes/reduce';
import relatoSelecionadoReducer from './relatoSelecionado/reduce';
import categoriaReducer from './categoria/reduce';

const rootReducer = combineReducers({
    userReducer,
    loadingReducer,
    notificacoesReducer,
    relatoSelecionadoReducer,
    categoriaReducer,
});

export default rootReducer;