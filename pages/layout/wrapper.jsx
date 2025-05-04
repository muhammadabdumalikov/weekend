import ReactQueryProvider from '../../providers/ReactQueryProvider'

const Wrapper = ( { children } ) =>
{
  return <ReactQueryProvider>{ children }</ReactQueryProvider>;
};

export default Wrapper;
