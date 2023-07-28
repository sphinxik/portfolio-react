import CurrenciesListItem from '../currenciesListItem/CurrenciesListItem';
import './currenciesList.scss';

function CurrenciesList(props) {
  const usedCurrencies = ["UAH", "USD", "EUR", "GBP", "PLN", "RUB"];

  return (
    <div className="rates-form__currencies-list">
      {
        usedCurrencies.map((currency) => <CurrenciesListItem key={currency} 
                                                             currency={currency} 
                                                             {...props} />)
      }
    </div>
  )
}

export default CurrenciesList;