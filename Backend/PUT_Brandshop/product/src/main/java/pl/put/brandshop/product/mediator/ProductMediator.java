package pl.put.brandshop.product.mediator;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import pl.put.brandshop.product.entity.*;
import pl.put.brandshop.product.exceptions.CategoryDontExistException;
import pl.put.brandshop.product.service.CategoryService;
import pl.put.brandshop.product.service.ProductService;
import pl.put.brandshop.product.translator.ProductEntityToProductDTO;
import pl.put.brandshop.product.translator.ProductEntityToSimpleProduct;
import pl.put.brandshop.product.translator.ProductFormToProductEntity;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ProductMediator
{
    @Value("${file-service.url}")
    private String FILE_SERVICE;

    private final ProductService productService;
    private final CategoryService categoryService;
    private final ProductEntityToSimpleProduct productEntityToSimpleProduct;
    private final ProductEntityToProductDTO productEntityToProductDTO;
    private final ProductFormToProductEntity productFormToProductEntity;

    public ResponseEntity<?> getProduct(int page, int limit, String name, String category, Float price_min, Float price_max, String data, String sort, String order, boolean admin)
    {
        if((name != null && !name.isEmpty()))
        {
            try
            {
                name = URLDecoder.decode(name, "UTF-8");
            } catch (UnsupportedEncodingException e)
            {
                throw new RuntimeException(e);
            }
        }
        List<ProductEntity> product = productService.getProduct(name, category, price_min, price_max, data, page, limit,sort,order,admin);
        product.forEach(value->{
            for (int i = 0; i < value.getImageUrls().length; i++){
                value.getImageUrls()[i] = FILE_SERVICE+"?uid="+value.getImageUrls()[i];
            }
        });
        if((name == null || name.isEmpty() || data == null || data.isEmpty())&&!admin)
        {
            List<SimpleProductDTO> simpleProductDTOS = new ArrayList<>();
            long totalCount = productService.countActiveProducts(name, category, price_min, price_max, admin);
            product.forEach(value->{
                simpleProductDTOS.add(productEntityToSimpleProduct.toSimpleProduct(value));
            });
            return ResponseEntity.ok().header("X-Total-Count",String.valueOf(totalCount)).body(simpleProductDTOS);
        }
        if(admin)
        {
            List<ProductDTO> ProductDTOS = new ArrayList<>();
            long totalCount = productService.countActiveProducts(name, category, price_min, price_max, admin);
            product.forEach(value->{
                ProductDTOS.add(productEntityToProductDTO.toProductDTO(value));
            });
            return ResponseEntity.ok().header("X-Total-Count",String.valueOf(totalCount)).body(ProductDTOS);
        }
        ProductDTO productDTO = productEntityToProductDTO.toProductDTO(product.get(0));
        return ResponseEntity.ok().body(productDTO);
    }

    public ResponseEntity<Response> saveProduct(ProductFormDTO productFormDTO)
    {
        try
        {
            ProductEntity productEntity = productFormToProductEntity.toProductEntity(productFormDTO);
            productEntity.setName(productFormDTO.getName());
            productEntity.setMainDesc(productFormDTO.getMainDesc());
            productEntity.setDescHtml(productFormDTO.getDescHtml());
            productEntity.setPrice(productFormDTO.getPrice());
            productEntity.setImageUrls(productFormDTO.getImagesUid());
            productEntity.setParameters(productFormDTO.getParameters());
            categoryService.findCategoryByShortID(productEntity.getCategory().getShortId()).ifPresentOrElse(productEntity::setCategory, ()->{
                throw new CategoryDontExistException();
            });
            productService.createProduct(productEntity);
            return ResponseEntity.ok(new Response("Successful created a product"));
        }
        catch (RuntimeException e)
        {
            return ResponseEntity.status(400).body(new Response("Can't create product, category don't exist"));
        }
    }

    public ResponseEntity<Response> deleteProduct(String uid)
    {
        try
        {
            productService.delete(uid);
            return ResponseEntity.ok(new Response("Successful delete product"));
        }
        catch (RuntimeException e)
        {
            e.printStackTrace();
            return ResponseEntity.status(400).body(new Response("Product dont exist"));
        }
    }

    public ResponseEntity<?> getProductExtend(String uid)
    {
        ProductEntity product = productService.getProductByUid(uid).orElse(null);
        if(product != null)
        {
            for(int i = 0; i < product.getImageUrls().length; i++)
            {
                product.getImageUrls()[i] = FILE_SERVICE+"?uid="+product.getImageUrls()[i];
            }
            return ResponseEntity.ok(product);
        }
        return ResponseEntity.status(400).body(new Response("Product dont exist"));
    }

    public ResponseEntity<Response> updateProduct(ProductFormDTO productFormDTO, String uid)
    {
        try
        {
            productService.update(productFormDTO,uid);
            return ResponseEntity.ok(new Response("Successful update product"));
        }
        catch (RuntimeException e)
        {
            e.printStackTrace();
            return ResponseEntity.status(400).body(new Response("Product dont exist"));
        }
    }
}
