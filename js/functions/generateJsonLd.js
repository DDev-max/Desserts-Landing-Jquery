import { baseUrl } from "../consts.js"


export function generateJsonLd({ type, from }) {
  if (type === 'recipeList' && 'data' in from) {
    const recipes = []
    from.data.forEach(elmnt => {
      const steps = elmnt.recipe.match(/[^.]+[.]/g)

      const recipeInst = []

      steps?.forEach(elmnt => {
        const step= {
          '@type': 'HowToStep',
          text: elmnt,
        }

        recipeInst.push(step)
      })

      const recipeJson = {
        '@type': 'Recipe',
        name: elmnt.dish,
        image: elmnt.image,
        description: elmnt.description,
        url: `${baseUrl}/#${elmnt.id}`,
        author: {
          '@type': 'Organization',
          name: 'Sweet Bliss Bakery',
        },
        cookTime: `PT${elmnt.cookingTimeMinutes}M`,
        prepTime: `PT${elmnt.minutesOfPreparation}M`,
        recipeYield: elmnt.recipeYield,
        recipeCategory: 'Desserts',
        nutrition: {
          '@type': 'NutritionInformation',
          calories: elmnt.calories,
        },
        recipeCuisine: elmnt.cuisine,
        recipeInstructions: recipeInst,
        recipeIngredient: elmnt.ingredients,
        keywords: elmnt.keywords,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: elmnt.stars,
          reviewCount: elmnt.reviewCount,
        },
      }

      recipes.push(recipeJson)
    })

    const itemsList = []
    recipes.forEach((elmnt, idx) => {
      const itemList = {
        '@type': 'ListItem',
        position: idx + 1,
        item: elmnt,
      }

      itemsList.push(itemList)
    })

    const fullJson = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: itemsList,
    }

    return JSON.stringify(fullJson)
  }

  if (type === 'faq' && Array.isArray(from) && from.every(elmnt => 'question' in elmnt)) {
    const questionAnswer = []

    from.forEach(elmnt => {
      const answer = {
        '@type': 'Answer',
        text: elmnt.answer,
      }

      const question= {
        '@type': 'Question',
        name: elmnt.question,
        acceptedAnswer: answer,
      }

      questionAnswer.push(question)
    })

    const faqJsonLd= {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: questionAnswer,
    }

    return JSON.stringify(faqJsonLd)
  }

  return ''
}